# Word Cards — notes for Claude

Polina (English teacher, teaches online) uses this site instead of Quizlet for her students' vocabulary.
Talk to her in Russian. She is not a developer: explain in plain words, no code unless she asks.

## Site
- Live: https://polinaelchevaa-hue.github.io/Learning-Words/ (GitHub Pages, branch `main`, single file `index.html`).
- After every change: commit, push to `main`, wait for the "pages build and deployment" run
  (`gh run list -R polinaelchevaa-hue/learning-words -L 1`) and tell her to refresh the page.
- Test with Playwright (Chromium is preinstalled) at phone width 390px before pushing; check `pageerror`.

## Access links (hash codes, see `GROUPS` / `TEACHER` in index.html)
- `#a1-k7p2` — A1 group (Speakout A2): Kate, Marta, Dasha, Ann → folder 0 "1A. Meeting people".
- `#b1-m4x9` — B1 group (American English File Intermediate): Olga, Rita, Mary → folder 1 "Food".
- `#teacher-7nq4` — teacher. Opening it once remembers the teacher in that browser; then the bare
  site URL shows the "My groups" dashboard (groups, students, Copy link buttons).
- `#irina-r5w8` — individual student Irina (group "Irina") → folder 2 "1A. Eating in and out"
  (she is a bit ahead of the program; her materials can later be opened to other groups via `folders`).
- Without a code students see "Please open the link your teacher sent you".
- Individual students: add an entry to `GROUPS` with its own code, `name`, `icon`, `students`, `folders`.

## Data (`const LIB=[...]` in index.html)
Folders → modules → words. A word is
`[English, Russian, example with ___, answers separated by "|", picture]`.
- picture = an emoji or a `data:image/jpeg;base64,...` (her photos, resized ≤400px, JPEG q≈82,
  light-blue frame cropped off when the image is 410×500).
- Gaps cover the whole phrase (one `___`), alternatives in field 4; `norm()` expands contractions
  and strips a leading a/an/the, so "she's" = "she is", "a doctor" = "doctor".
- Her Quizlet exports: term<TAB>definition, then the example on the next line.
- Folder 0 modules: 1. Meet & Greet (34, her Quizlet), 2. My routine (25, her Quizlet + 16 photos),
  3. Jobs (30, her Quizlet + 28 photos). Folder 2 "1A. Eating in and out" (Irina): module 1. Food (44 words, her Quizlet + 38 photos, NO Russian translations — B1 level, picture is the clue;
  field 1 may hold her English definition, field 2 only her own examples; cottage cheese / cream cheese / yummy / gross still use emoji);
  module 2. Cooking is still to come. Folder 1 "Food" (B1) was written by Claude from lessons,
  not from her Quizlet yet.

## Words without translation (B1)
If field 1 (Russian) is empty the card shows the picture + "What is it?"; Match pairs word↔picture; Build skips
words without an example; the RU/EN front switch is hidden in such modules. Transcription like `/læm/` in the
English field is ignored by the voice (`noIPA`). Polina does NOT want Russian translations for B1 students.

## Modes
Learn · Flashcards (Flip through / Sort ✓✗, star, shuffle) · Gap fill · Match · Build (sentence from
words) · Spell it (letters in order, ≤16 letters) · Test (12 mixed: choice, write, build, spell;
"Send to teacher" copies/shares the result). "Say it" (speech recognition) was removed at her request;
`qSay` code is still in the file, unused.
- Still learning list = per-folder `weak_` list; mistakes in any mode go there.
- Voice: 🔊 only on tap (no auto-speech). Single words use dictionaryapi.dev recordings, phrases use the
  best browser voice; voice picker + "dictionary recordings" checkbox in the module view.

## Students & progress
- First visit asks the student's name (stored as `myname`); "change name" link on the home screen.
- "📤 Share my progress with the teacher" button (home + folder) → text summary via share/copy.
- Cloud sync to her Google Sheet via Apps Script web app (`SYNC_URL` in index.html,
  script source in `sync/apps-script.gs`, sheet tab "Progress", one row per group+name).
  Identity = group code + name (case-insensitive) — same name in the same group would collide;
  suggest "Name + surname initial" if that happens. Merge is per word by latest timestamp (`ts_`).
- localStorage keys per folder name: `known_`, `weak_`, `stars_`, `ts_`, `tests_`, `best_…`.
- Manual "move progress with a code" (`makeCode`/`moveIn`/`moveOut`) still exists but its buttons
  were removed because sync replaced it.

## Design
Palette Espresso `#3e2723`, Petal `#f4c9d6`, Ivory `#f5f0e6`; font Poppins. Header text:
"Choose a folder and a module. Study the words!" Watch out: `.tile` and `.done b` are existing styles —
new elements must not reuse those class names.

## Open ideas she may come back to
- Lists of her ~15 students to add (individual links + folders), more modules from Quizlet.
- B1 Food modules with her own words/photos.
- Screen-recording video about the site: she records the screen silently and a voiceover separately;
  Claude offered to assemble it (ffmpeg) and add subtitles.
