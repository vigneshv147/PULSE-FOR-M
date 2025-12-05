import { useState, useEffect, useRef } from "react";
import { aiService } from "@/services/AIService";
import { MessageSquare, X, Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface VoiceAssistantProps {
    onClose: () => void;
    onSwitchMode: () => void;
}

interface OllamaResponse {
    response: string;
}

const VoiceAssistant = ({ onClose, onSwitchMode }: VoiceAssistantProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm M-Pulse Voice AI. Tap the mic to speak." },
    ]);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const recognitionRef = useRef<any>(null);

    // Initialize SpeechRecognition
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                handleSend(transcript);
            };

            recognitionRef.current.onend = () => setListening(false);
        }
    }, []);

    // Function to speak AI text safely
    const speak = (text: string) => {
        if (!text) return;

        // Stop any ongoing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        utterance.onend = () => {
            console.log("Finished speaking.");
        };

        speechSynthesis.speak(utterance);
    };

    // Handle sending message
    const handleSend = async (messageText: string) => {
        if (!messageText.trim()) return;

        const userMessage: Message = { role: "user", content: messageText };
        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);

        // Stop any ongoing speech when user sends new input
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        try {
            const response = await aiService.chat(messageText);

            const assistantMessage: Message = {
                role: "assistant",
                content: response,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Speak only after message is added
            speak(assistantMessage.content);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unable to connect to AI.";
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: errorMessage },
            ]);
            speak(errorMessage);
        }

        setLoading(false);
    };

    // Clear chat
    const handleClear = () => {
        setMessages([{ role: "assistant", content: "Hello! I'm M-Pulse Voice AI. Tap the mic to speak." }]);

        // Stop any ongoing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    };

    // Toggle voice listening
    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setListening(true);
        }
    };

    return (
        <div className="h-full flex flex-col bg-card border-l border-border shadow-elevated">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-border gradient-primary">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-semibold text-primary-foreground">
                        Voice Assistant
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onSwitchMode} title="Switch to Text Mode">
                        <MessageSquare className="h-4 w-4" />
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

            {/* VOICE CONTROLS */}
            <div className="p-4 border-t border-border flex flex-col items-center gap-4">
                <Button
                    onClick={toggleListening}
                    size="lg"
                    className={`rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 ${listening ? "bg-destructive hover:bg-destructive/90 animate-pulse scale-110" : "gradient-primary"
                        }`}
                >
                    {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
                <p className="text-sm text-muted-foreground">
                    {listening ? "Listening..." : "Tap to speak"}
                </p>
            </div>
        </div>
    );
};

export default VoiceAssistant;
