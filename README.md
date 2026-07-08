# Adrenaline07.github.io

Personal portfolio, live at https://adrenaline07.github.io

## How to edit this site

Everything lives in three files:

- `index.html` : all the text and content (bio, projects, publications, CV timeline, links)
- `style.css` : colors, fonts, layout
- `script.js` : animations (typing effect, particles, scroll reveals)

### Common edits

1. **Change any text**: open `index.html`, find the section, edit the words, save.
2. **Add a project image or GIF**: put the file in `assets/` (e.g. `assets/robot.gif`),
   then in the project card replace the placeholder div with:
   `<img src="assets/robot.gif" alt="description">`
3. **Update the CV**: replace `assets/Faith_Ogunwoye_CV.pdf` with the new PDF (keep the same filename).
4. **Add a publication**: copy one `<article class="pub reveal">...</article>` block in the
   publications section and edit it.

### Publish changes

```bash
git add -A
git commit -m "update site"
git push
```

The live site updates itself about a minute after pushing. You can also edit files
directly on github.com (open the file, click the pencil icon, commit) with no terminal needed.
