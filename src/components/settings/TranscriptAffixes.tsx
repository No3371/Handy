import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Input } from "../ui/Input";
import { SettingContainer } from "../ui/SettingContainer";

interface TranscriptAffixesProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const TranscriptAffixes: React.FC<TranscriptAffixesProps> = React.memo(
  ({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const storedPrefix = getSetting("transcript_prefix") ?? "";
    const storedSuffix = getSetting("transcript_suffix") ?? "";

    // Edited locally and committed on blur/Enter so a setting write is not sent
    // per keystroke.
    const [prefix, setPrefix] = useState(storedPrefix);
    const [suffix, setSuffix] = useState(storedSuffix);

    useEffect(() => setPrefix(storedPrefix), [storedPrefix]);
    useEffect(() => setSuffix(storedSuffix), [storedSuffix]);

    const commit = (key: "transcript_prefix" | "transcript_suffix") => {
      const value = key === "transcript_prefix" ? prefix : suffix;
      const stored = key === "transcript_prefix" ? storedPrefix : storedSuffix;
      if (value !== stored) {
        updateSetting(key, value);
      }
    };

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
      key: "transcript_prefix" | "transcript_suffix",
    ) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit(key);
      }
    };

    const sample = t("settings.advanced.transcriptAffixes.sample");

    return (
      <SettingContainer
        title={t("settings.advanced.transcriptAffixes.title")}
        description={t("settings.advanced.transcriptAffixes.description")}
        descriptionMode={descriptionMode}
        grouped={grouped}
        layout="stacked"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              className="flex-1 min-w-0"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              onBlur={() => commit("transcript_prefix")}
              onKeyDown={(e) => handleKeyDown(e, "transcript_prefix")}
              placeholder={t(
                "settings.advanced.transcriptAffixes.prefixPlaceholder",
              )}
              aria-label={t("settings.advanced.transcriptAffixes.prefixLabel")}
              variant="compact"
              disabled={isUpdating("transcript_prefix")}
            />
            <Input
              type="text"
              className="flex-1 min-w-0"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              onBlur={() => commit("transcript_suffix")}
              onKeyDown={(e) => handleKeyDown(e, "transcript_suffix")}
              placeholder={t(
                "settings.advanced.transcriptAffixes.suffixPlaceholder",
              )}
              aria-label={t("settings.advanced.transcriptAffixes.suffixLabel")}
              variant="compact"
              disabled={isUpdating("transcript_suffix")}
            />
          </div>
          {(prefix || suffix) && (
            <p className="text-xs text-mid-gray break-words">
              <span className="mr-1">
                {t("settings.advanced.transcriptAffixes.preview")}
              </span>
              <span className="font-mono whitespace-pre-wrap">
                {`${prefix}${sample}${suffix}`}
              </span>
            </p>
          )}
        </div>
      </SettingContainer>
    );
  },
);
