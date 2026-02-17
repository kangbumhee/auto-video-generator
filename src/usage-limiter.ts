// src/usage-limiter.ts
// ============================================================
// 사용량 추적 + 제한 시스템 (JSON 파일 기반)
// 실제 배포 시 Redis/DB로 교체
// ============================================================

import fs from "fs";
import path from "path";
import { getTier, type PricingTier } from "./pricing";

interface UserUsage {
  id: string;
  email: string;
  tier: "free" | "pro" | "enterprise";
  dailyCount: number;
  monthlyCount: number;
  ttsCharsUsed: number;
  storageUsedMb: number;
  lastResetDate: string;
  lastMonthReset: string;
  createdAt: string;
  history: {
    date: string;
    action: string;
    details: string;
  }[];
}

const USAGE_FILE = path.join(process.cwd(), "usage-data.json");

function loadUsage(): Record<string, UserUsage> {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}

function saveUsage(data: Record<string, UserUsage>) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getThisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function getOrCreateUser(
  userId: string,
  email = "local@user"
): UserUsage {
  const all = loadUsage();
  if (!all[userId]) {
    all[userId] = {
      id: userId,
      email,
      tier: "free",
      dailyCount: 0,
      monthlyCount: 0,
      ttsCharsUsed: 0,
      storageUsedMb: 0,
      lastResetDate: getToday(),
      lastMonthReset: getThisMonth(),
      createdAt: new Date().toISOString(),
      history: [],
    };
    saveUsage(all);
  }

  const user = all[userId]!;

  if (user.lastResetDate !== getToday()) {
    user.dailyCount = 0;
    user.lastResetDate = getToday();
  }

  if (user.lastMonthReset !== getThisMonth()) {
    user.monthlyCount = 0;
    user.ttsCharsUsed = 0;
    user.lastMonthReset = getThisMonth();
  }

  saveUsage(all);
  return user;
}

export function checkLimit(
  userId: string,
  action: "video" | "tts",
  amount = 1
): { allowed: boolean; reason: string; remaining: number } {
  const user = getOrCreateUser(userId);
  const tier = getTier(user.tier);

  if (action === "video") {
    if (user.dailyCount >= tier.limits.videosPerDay) {
      return {
        allowed: false,
        reason: `일일 영상 생성 한도 초과 (${tier.limits.videosPerDay}회/일). ${
          user.tier === "free" ? "Pro로 업그레이드하면 무제한!" : ""
        }`,
        remaining: 0,
      };
    }
    if (user.monthlyCount >= tier.limits.videosPerMonth) {
      return {
        allowed: false,
        reason: `월간 영상 생성 한도 초과 (${tier.limits.videosPerMonth}회/월).`,
        remaining: 0,
      };
    }
    return {
      allowed: true,
      reason: "",
      remaining: Math.min(
        tier.limits.videosPerDay - user.dailyCount,
        tier.limits.videosPerMonth - user.monthlyCount
      ),
    };
  }

  if (action === "tts") {
    if (user.ttsCharsUsed + amount > tier.limits.ttsCharactersPerMonth) {
      return {
        allowed: false,
        reason: `TTS 글자 수 한도 초과 (${tier.limits.ttsCharactersPerMonth.toLocaleString()}자/월).`,
        remaining: tier.limits.ttsCharactersPerMonth - user.ttsCharsUsed,
      };
    }
    return {
      allowed: true,
      reason: "",
      remaining: tier.limits.ttsCharactersPerMonth - user.ttsCharsUsed,
    };
  }

  return { allowed: true, reason: "", remaining: 9999 };
}

export function recordUsage(
  userId: string,
  action: "video" | "tts",
  amount = 1,
  details = ""
) {
  const all = loadUsage();
  const user = all[userId];
  if (!user) return;

  if (action === "video") {
    user.dailyCount += 1;
    user.monthlyCount += 1;
  }
  if (action === "tts") {
    user.ttsCharsUsed += amount;
  }

  user.history.push({
    date: new Date().toISOString(),
    action,
    details,
  });

  if (user.history.length > 100) {
    user.history = user.history.slice(-100);
  }

  saveUsage(all);
}

export function upgradeTier(
  userId: string,
  newTier: "free" | "pro" | "enterprise"
) {
  const all = loadUsage();
  if (all[userId]) {
    all[userId]!.tier = newTier;
    all[userId]!.history.push({
      date: new Date().toISOString(),
      action: "upgrade",
      details: `요금제 변경: ${newTier}`,
    });
    saveUsage(all);
  }
}

export function getUserStats(userId: string) {
  const user = getOrCreateUser(userId);
  const tier = getTier(user.tier);
  return {
    user,
    tier,
    usage: {
      videosToday: user.dailyCount,
      videosThisMonth: user.monthlyCount,
      ttsCharsUsed: user.ttsCharsUsed,
      storageMb: user.storageUsedMb,
    },
    limits: tier.limits,
    remaining: {
      videosToday: Math.max(0, tier.limits.videosPerDay - user.dailyCount),
      videosThisMonth: Math.max(
        0,
        tier.limits.videosPerMonth - user.monthlyCount
      ),
      ttsChars: Math.max(
        0,
        tier.limits.ttsCharactersPerMonth - user.ttsCharsUsed
      ),
      storageMb: Math.max(
        0,
        tier.limits.storageGb * 1024 - user.storageUsedMb
      ),
    },
  };
}
