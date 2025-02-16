"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Cog } from "lucide-react";

export default function Settings() {
    const [autoDelete, setAutoDelete] = useState(false);
    const [autoDeleteDays, setAutoDeleteDays] = useState("7");
    const [defaultProtection, setDefaultProtection] = useState(false);
    const [defaultPassword, setDefaultPassword] = useState("");
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [emailServer, setEmailServer] = useState("");

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Cog className="h-8 w-8" />
                    <h1 className="text-4xl font-bold">Settings</h1>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>File Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-lg">Auto Delete Files</Label>
                                        <p className="text-sm text-muted-foreground max-w-[500px]">
                                            Automatically delete files after a specified number of days
                                        </p>
                                    </div>
                                    <Switch
                                        checked={autoDelete}
                                        onCheckedChange={setAutoDelete}
                                    />
                                </div>

                                {autoDelete && (
                                    <div className="space-y-2 max-w-[400px]">
                                        <Label>Days until deletion</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={autoDeleteDays}
                                            onChange={(e) => setAutoDeleteDays(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-lg">Default Password Protection</Label>
                                        <p className="text-sm text-muted-foreground max-w-[500px]">
                                            Enable password protection by default for new files
                                        </p>
                                    </div>
                                    <Switch
                                        checked={defaultProtection}
                                        onCheckedChange={setDefaultProtection}
                                    />
                                </div>

                                {defaultProtection && (
                                    <div className="space-y-2 max-w-[400px]">
                                        <Label>Default Password</Label>
                                        <Input
                                            type="password"
                                            value={defaultPassword}
                                            onChange={(e) => setDefaultPassword(e.target.value)}
                                            placeholder="Enter default password"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sharing Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-lg">Email Sharing</Label>
                                        <p className="text-sm text-muted-foreground max-w-[500px]">
                                            Enable sharing files via email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailEnabled}
                                        onCheckedChange={setEmailEnabled}
                                    />
                                </div>

                                {emailEnabled && (
                                    <div className="space-y-2 max-w-[400px]">
                                        <Label>SMTP Server</Label>
                                        <Input
                                            value={emailServer}
                                            onChange={(e) => setEmailServer(e.target.value)}
                                            placeholder="smtp://example.com:587"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}