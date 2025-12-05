import { useState } from "react";
import { aiService } from "@/services/AIService";
import { Mic, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface TextAssistantProps {
    onClose: () => void;
    onSwitchMode: () => void;
}

interface OllamaResponse {
    response: string;
}

const TextAssistant = ({ onClose, onSwitchMode }: TextAssistantProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm M-Pulse Text AI. How can I help you?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle sending message
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        const currentInput = input;
        setInput("");
        setLoading(true);

        try {
            const response = await aiService.chat(currentInput);

            const assistantMessage: Message = {
                role: "assistant",
                content: response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unable to connect to AI.";
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: errorMessage },
            ]);
        }

        setLoading(false);
    };

    // Clear chat
    const handleClear = () => {
        setMessages([{ role: "assistant", content: "Hello! I'm M-Pulse Text AI. How can I help you?" }]);
    };

    return (
        <div className="h-full flex flex-col bg-card border-l border-border shadow-elevated">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-border gradient-primary">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-semibold text-primary-foreground">
                        Text Assistant
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onSwitchMode} title="Switch to Voice Mode">
                        <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                        Clear
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* MESSAGES */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-muted text-foreground rounded-lg p-3">
                                <Loader2 className="animate-spin h-4 w-4" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* INPUT AREA */}
            <div className="p-4 border-t border-border flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    disabled={loading}
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="gradient-primary"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default TextAssistant;
