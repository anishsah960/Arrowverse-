// AdMob & Mobile Ads Integration Manager
// App ID: ca-app-pub-7772392105730211~8429540348
// Interstitial Ad Unit ID: ca-app-pub-7772392105730211/1316699057

export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-7772392105730211~8429540348',
  interstitialAdUnitId: 'ca-app-pub-7772392105730211/1316699057',
  // AdMob Policy compliance: minimum cooldown between interstitials (e.g. 90 seconds or every 3 levels)
  cooldownSeconds: 90,
  levelsBetweenAds: 3,
};

let lastAdShownTimestamp = 0;
let levelsCompletedSinceLastAd = 0;

export interface AdManager {
  showInterstitial: (placementName?: string) => boolean;
  onLevelCompleted: () => void;
  onGameOver: () => void;
}

// Check if Android Native WebView Bridge is available (WebIntoApp, AppsGeyser, Capacitor, Cordova, etc.)
declare global {
  interface Window {
    Android?: {
      showInterstitial?: () => void;
      showAd?: (unitId: string) => void;
    };
    WebIntoApp?: {
      showInterstitial?: () => void;
    };
    AppsGeyser?: {
      showInterstitial?: () => void;
    };
    admob?: {
      interstitial?: {
        show: () => void;
      };
    };
    google?: any;
  }
}

/**
 * Triggers an interstitial ad if policy conditions & frequency caps are met.
 * Compliance: Never interrupts active gameplay; only shown at natural pauses (level completion/game over).
 */
export function triggerInterstitialAd(reason: 'level_complete' | 'game_over' | 'manual' = 'level_complete'): boolean {
  const now = Date.now();
  const timeSinceLastAd = (now - lastAdShownTimestamp) / 1000;

  // Enforce frequency cap & cooldown to comply with AdMob interstitial policies
  if (reason !== 'manual') {
    if (timeSinceLastAd < ADMOB_CONFIG.cooldownSeconds && levelsCompletedSinceLastAd < ADMOB_CONFIG.levelsBetweenAds) {
      return false;
    }
  }

  // 1. Try native Web-to-App Android Javascript interface
  if (typeof window !== 'undefined') {
    if (window.Android?.showInterstitial) {
      window.Android.showInterstitial();
      lastAdShownTimestamp = now;
      levelsCompletedSinceLastAd = 0;
      return true;
    }

    if (window.Android?.showAd) {
      window.Android.showAd(ADMOB_CONFIG.interstitialAdUnitId);
      lastAdShownTimestamp = now;
      levelsCompletedSinceLastAd = 0;
      return true;
    }

    if (window.WebIntoApp?.showInterstitial) {
      window.WebIntoApp.showInterstitial();
      lastAdShownTimestamp = now;
      levelsCompletedSinceLastAd = 0;
      return true;
    }

    if (window.AppsGeyser?.showInterstitial) {
      window.AppsGeyser.showInterstitial();
      lastAdShownTimestamp = now;
      levelsCompletedSinceLastAd = 0;
      return true;
    }

    if (window.admob?.interstitial?.show) {
      window.admob.interstitial.show();
      lastAdShownTimestamp = now;
      levelsCompletedSinceLastAd = 0;
      return true;
    }
  }

  // If running in browser or preview mode, log for verification
  lastAdShownTimestamp = now;
  levelsCompletedSinceLastAd = 0;
  return false;
}

export function recordLevelCompletedForAds() {
  levelsCompletedSinceLastAd++;
  if (levelsCompletedSinceLastAd >= ADMOB_CONFIG.levelsBetweenAds) {
    triggerInterstitialAd('level_complete');
  }
}

export function recordGameOverForAds() {
  triggerInterstitialAd('game_over');
}
