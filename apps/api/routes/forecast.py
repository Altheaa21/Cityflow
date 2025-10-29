import os
from functools import lru_cache
from typing import Tuple, Dict

from fastapi import APIRouter, HTTPException, Query
from huggingface_hub import snapshot_download
from transformers import (
    T5ForConditionalGeneration,
    T5TokenizerFast,
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
)

router = APIRouter()

# === model map ===
MODEL_MAP: Dict[str, str] = {
    "baseline": "Altheaa21/Category-baseline",
    "bar": "Altheaa21/Category-bar",
    "coffeeshop": "Altheaa21/Category-CoffeeShop",
    "metrostation": "Altheaa21/Category-MetroStation",
}

HF_TOKEN   = os.getenv("HF_TOKEN")
HF_CACHE   = os.getenv("HF_HOME", ".hf_cache")

if not HF_TOKEN:
    print("⚠️  Warning: HF_TOKEN not found; private repos can not be accessed")

ALLOW_PATTERNS = [
    "config.json",
    "generation_config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "special_tokens_map.json",
    "model.safetensors",
]

# Global storage: Avoid duplicate loading
LOADED: Dict[str, Tuple[object, object]] = {}  # repo_id -> (model, tokenizer)

def _download_repo(repo_id: str) -> str:
    """Download and return to the local directory (if the cache is hit, return instantly)."""
    local_dir = snapshot_download(
        repo_id=repo_id,
        token=HF_TOKEN,
        cache_dir=HF_CACHE,
        allow_patterns=ALLOW_PATTERNS,
    )
    return local_dir

def _load_model_tokenizer(repo_id: str) -> Tuple[object, object]:
    """Prioritize explicit loading using T5; only resort to Auto as a fallback if that fails."""
    local_dir = _download_repo(repo_id)

    # Try explicit T5 first
    try:
        tok = T5TokenizerFast.from_pretrained(local_dir)
        mdl = T5ForConditionalGeneration.from_pretrained(local_dir)
        print(f"✅ [T5] loaded: {repo_id}")
        return mdl, tok
    except Exception as t5_err:
        print(f"⚠️ [T5] load failed for {repo_id}: {t5_err}\n→ fallback to AutoModelForSeq2SeqLM")

    # Auto
    tok = AutoTokenizer.from_pretrained(local_dir, use_fast=True)
    mdl = AutoModelForSeq2SeqLM.from_pretrained(local_dir)
    print(f"✅ [Auto] loaded: {repo_id}")
    return mdl, tok

def get_model(category: str, model_type: str) -> Tuple[object, object, str]:
    """
    Select a repository based on category and model_type; either match or load from LOADED; return (model, tokenizer, repo_id).
    """
    if model_type == "baseline":
        repo_id = MODEL_MAP["baseline"]
    elif model_type == "finetune":
        # Normalize the category to the map key
        key = category.lower().replace(" ", "")
        if key not in MODEL_MAP:
            raise HTTPException(status_code=400, detail=f"Unsupported category for finetune: {category}")
        repo_id = MODEL_MAP[key]
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported model_type: {model_type}")

    if repo_id in LOADED:
        return LOADED[repo_id][0], LOADED[repo_id][1], repo_id

    mdl, tok = _load_model_tokenizer(repo_id)
    LOADED[repo_id] = (mdl, tok)
    return mdl, tok, repo_id


@router.get("/forecast")
def forecast(
    city: str = Query(...),
    category: str = Query(...),
    model_type: str = Query("baseline"),
    query: str = Query("predict next day"),
):
    try:
        model, tokenizer, repo = get_model(category, model_type)

        # ===== Your original prompt/generated parameters =====
        input_text = f"[city={city}] [category={category}] {query}"
        inputs = tokenizer([input_text], return_tensors="pt")

        ids = model.generate(
            **inputs,
            max_new_tokens=32,
            do_sample=False
        )
        pred = tokenizer.batch_decode(ids, skip_special_tokens=True)[0]

        # sturcture return
        # define a pretty model name
        pretty_model_name = ""

        if "baseline" in repo.lower():
            pretty_model_name = "Baseline model"
        else:
            # get category key word(like CoffeeShop、Bar、MetroStation)
            for cat in ["CoffeeShop", "Bar", "MetroStation"]:
                if cat.lower() in repo.lower():
                    pretty_model_name = f"{cat} finetune model"
                    break
            if not pretty_model_name:
                pretty_model_name = "Finetune model"

        return {
            "model": pretty_model_name,
            "prediction": pred,
            "interval": [0, 0],
            "advice": "✅ Inference ok"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")