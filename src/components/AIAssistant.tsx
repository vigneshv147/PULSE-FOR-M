import { useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import TextAssistant from "./TextAssistant";

interface AIAssistantProps {
  onClose: () => void;
}

type AssistantMode = "text" | "voice";

const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [mode, setMode] = useState<AssistantMode>("text");

  return (
    <>
      {mode === "text" ? (
        <TextAssistant
          onClose={onClose}
          onSwitchMode={() => setMode("voice")}
        />
      ) : (
        <VoiceAssistant
          onClose={onClose}
          onSwitchMode={() => setMode("text")}
        />
      )}
    </>
  );
};

export default AIAssistant;
