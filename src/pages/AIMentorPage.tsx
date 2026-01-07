import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';

export function AIMentorPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI learning mentor. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response (static for MVP)
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: 'I understand you\'re asking about: "' + input + '". In the MVP version, I\'m here to guide you, but full AI capabilities are coming soon! Try using the "Find inside this video" feature on video pages to search for specific topics.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
        <p className="text-muted-foreground">
          Get personalized learning guidance and answers to your questions
        </p>
      </div>

      <div className="flex gap-6">
        {/* Chat Area */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat
            </CardTitle>
            <CardDescription>
              Ask questions about any topic you're learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Context Panel */}
        <aside className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Context</CardTitle>
              <CardDescription>
                Selected video or topic context will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Current Context
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No video or topic selected. Navigate to a video page and
                    select a topic to get contextual help.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Ask about specific concepts</li>
                    <li>Request explanations of topics</li>
                    <li>Get learning recommendations</li>
                    <li>Ask for clarification on difficult concepts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

