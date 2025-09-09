
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

type ChecklistItem = {
    id: string;
    label: string;
    points: number;
    checked: boolean;
};

const initialChecklistItems: ChecklistItem[] = [
    { id: 'uniquePasswords', label: 'I use a unique password for every important account.', points: 20, checked: false },
    { id: '2faEmail', label: 'My primary email account is protected with Two-Factor Authentication (2FA).', points: 20, checked: false },
    { id: 'passwordManager', label: 'I use a password manager to store my passwords securely.', points: 15, checked: false },
    { id: 'autoUpdates', label: 'My phone and computer are set to install software updates automatically.', points: 15, checked: false },
    { id: 'publicWifiVpn', label: 'I use a VPN when on public Wi-Fi.', points: 10, checked: false },
    { id: 'phishingAwareness', label: 'I know how to spot a phishing email (e.g., checking sender address).', points: 10, checked: false },
    { id: 'backups', label: 'I have a recent backup of my important files (photos, documents).', points: 10, checked: false },
];

export default function SecurityScoreChecklist() {
    const [items, setItems] = useState<ChecklistItem[]>(initialChecklistItems);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const newScore = items.reduce((total, item) => (item.checked ? total + item.points : total), 0);
        setScore(newScore);
    }, [items]);

    const handleCheckChange = (id: string) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const getProgressColor = (currentScore: number) => {
        if (currentScore < 40) return "bg-destructive";
        if (currentScore < 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getRecommendation = (currentScore: number) => {
        if (currentScore === 100) {
            return "Fantastic! You're following all the key best practices.";
        }
        const nextUnchecked = items.find(item => !item.checked);
        if (nextUnchecked) {
            return `Great start! Your next big win is to: ${nextUnchecked.label}`;
        }
        return "You're doing great! Keep it up.";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Personal Security Score</CardTitle>
                <CardDescription>Complete this checklist to see how secure you are and get tips to improve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center space-x-3">
                            <Checkbox 
                                id={item.id} 
                                checked={item.checked} 
                                onCheckedChange={() => handleCheckChange(item.id)}
                            />
                            <Label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">Your Score: {score}/100</span>
                    </div>
                    <Progress value={score} className="h-4" indicatorClassName={getProgressColor(score)} />
                    <p className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {getRecommendation(score)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
