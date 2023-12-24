'use client'

import { Textarea } from "@/components/ui/textarea";
import { useText } from "@/hooks/useText";

const HomePage = () => {
  const {text, setText} = useText();

  const handleChange = (event: any) => setText(event.target.value);

  const handleBlur = (event: any) => {
    const { value } = event.target;
    fetch("/api/text", {
      method: "POST",
      body: JSON.stringify({text: value}),
    });
    setText(value);
  };

  return (
    <main className="flex justify-center items-center h-[calc(100dvh-48px)]">
      <Textarea
        onBlur={handleBlur}
        className="bg-[#8f8f8f] max-w-screen-xl h-[57vh] text-lg"
        id="textArea"
        value={text}
        onChange={handleChange}
      />
    </main>
  );
}

export default HomePage;
