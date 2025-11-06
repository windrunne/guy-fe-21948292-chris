// Markdown renderer component with custom styling

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mb-3 mt-4 first:mt-0 text-gray-900" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0 text-gray-900" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold mb-2 mt-3 first:mt-0 text-gray-900" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-semibold mb-1 mt-2 first:mt-0 text-gray-900" {...props} />
        ),
        // Paragraphs
        p: ({ node, ...props }) => (
          <p className="mb-3 leading-relaxed last:mb-0 text-gray-700" {...props} />
        ),
        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-3 space-y-1 ml-4 text-gray-700" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1 ml-4 text-gray-700" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="leading-relaxed" {...props} />
        ),
        // Code blocks
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200"
              {...props}
            />
          ) : (
            <code
              className="block bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => <pre className="mb-3" {...props} />,
        // Links
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-3 text-gray-600"
            {...props}
          />
        ),
        // Horizontal rule
        hr: ({ node, ...props }) => <hr className="my-4 border-gray-200" {...props} />,
        // Strong and emphasis
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-gray-900" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        // Tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border-collapse border border-gray-300" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
        tbody: ({ node, ...props }) => <tbody {...props} />,
        tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

