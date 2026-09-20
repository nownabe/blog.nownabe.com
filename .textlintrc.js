// Errors are mechanical and block CI. Warnings are style hints to read while writing;
// they never fail the check. Rules that would contradict this blog's voice are off.
const warning = (options = {}) => ({ severity: "warning", ...options });

module.exports = {
  plugins: {
    "@textlint/markdown": {
      extensions: [".md"],
    },
  },
  rules: {
    "preset-ja-spacing": {
      "ja-space-between-half-and-full-width": {
        space: "always",
        exceptPunctuation: true,
      },
      "ja-space-around-code": {
        before: true,
        after: true,
      },
      "ja-space-around-link": {
        before: true,
        after: true,
      },
      "ja-no-space-around-parentheses": false,
    },

    "preset-ja-technical-writing": {
      // Style hints
      "sentence-length": warning({ max: 120 }),
      "max-comma": warning(),
      "max-ten": warning(),
      "max-kanji-continuous-len": warning(),
      "ja-no-redundant-expression": warning(),
      "ja-no-weak-phrase": warning(),
      "ja-no-successive-word": warning(),
      "no-doubled-joshi": warning(),
      "no-doubled-conjunction": warning(),
      "no-doubled-conjunctive-particle-ga": warning(),
      "no-double-negative-ja": warning(),
      "ja-no-mixed-period": warning({ allowEmojiAtEnd: true, allowPeriodMarks: [":"] }),

      // Off: the mixed register, ら抜き and exclamation marks are this blog's voice;
      // arabic-kanji-numbers rewrites 何一つ to 何1つ; ja-unnatural-alphabet flags math symbols.
      "no-mix-dearu-desumasu": false,
      "no-dropping-the-ra": false,
      "no-exclamation-question-mark": false,
      "arabic-kanji-numbers": false,
      "ja-unnatural-alphabet": false,
    },
  },
};
