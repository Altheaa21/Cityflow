export default function MessageList({ messages, loading }) {
  // when there's no messages
  if (messages.length === 0 && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#94a3b8]">
        Let’s start a conversation: For example, “My daily sales from October 1st to October 6th are 500/520/530/560/580/610, what is the sales on October 7th?”
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((m, i) => {
        const isUser = m.role === "user";

        // model reply
        if (!isUser) {
          return (
            <div
              key={i}
              className="self-start max-w-[66%] whitespace-pre-wrap break-words leading-relaxed text-[#0f172a]"
            >
              {m.text}
            </div>
          );
        }

        // user input
        return (
          <div
            key={i}
            className="
              self-end                       
              max-w-[66%]        
              whitespace-pre-wrap break-words leading-relaxed
              bg-[#e5e7eb] text-[#0f172a] rounded-[24px] shadow-md border border-[#d1d5db]
              px-5 py-3 
              text-right
              mt-2 mb-2 mr-3 ml-12
            "
            style = {{padding: 10}}
          >
            {m.text}
          </div>
        );
      })}

      {/* loading */}
      {loading && (
        <div className="self-start max-w-[66%] whitespace-pre-wrap break-words leading-relaxed text-[#64748b]">
          Thinking…
        </div>
      )}
    </div>
  );
}
