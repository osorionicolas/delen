"use client"
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import CopyButton from "./copy-button"
import { MessageSquare } from "lucide-react"
import { Button } from "./ui/button"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import { Text } from "@/lib/definitions";

const TextShare = () => {
    const [content, setContent] = useState("");

    const { data: texts = [], isLoading } = useQuery<Text[]>({
        queryKey: ["/api/text"],
    });

    const shareMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/text", { text: content });
        },
        onSuccess: () => {
            setContent("");
            queryClient.invalidateQueries({ queryKey: ["/api/text"] });
            toast.success("Text shared successfully");
            queryClient.fetchQuery({ queryKey: ["/api/text"] });
        },
        onError: () => {
            toast.error("Failed to share text");
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Share Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Type something to share..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button
                    className="w-full"
                    onClick={() => shareMutation.mutate()}
                    disabled={!content.trim() || shareMutation.isPending}
                >
                    {shareMutation.isPending ? "Sharing..." : "Share"}
                </Button>

                <div className="space-y-2">
                    <h3 className="font-semibold">Shared Texts</h3>
                    {isLoading ? (
                        <div className="animate-pulse">Loading...</div>
                    ) : texts.length === 0 ? (
                        <div className="text-muted-foreground text-center py-4">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No shared texts yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {texts.map((text: Text) => (
                                <div
                                    key={text.id}
                                    className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                                >
                                    <span>
                                        {text.content}
                                    </span>
                                    <CopyButton text={text.content} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TextShare