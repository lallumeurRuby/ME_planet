---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## 3D Design Aesthetics (Three.js / R3F)

When the interface involves a 3D canvas, apply an additional design layer:

- **Scene Composition**: Consider Camera FOV (narrow = telephoto drama, wide = immersive), depth staging (foreground / midground / background objects), and spatial hierarchy that guides attention.
- **Lighting Design**: Combine ambient (base fill), directional (sun/key light), and point lights (local accents) intentionally. Shadows add weight; bloom adds magic. Avoid flat, uniformly-lit scenes.
- **Material Quality**: Use PBR materials with purposeful `metalness` and `roughness` values. Add environment maps for reflections. Normal maps for surface micro-detail without polygon cost.
- **Motion & Animation**: Use `useFrame` for continuous motion (rotation, float, particle drift). Prefer eased, organic motion over linear transforms. Camera fly-throughs should decelerate on arrival.
- **2D ↔ 3D Transitions**: Layer HTML overlays (`<Html>` from drei) for UI elements inside the canvas. Transition between 2D panels and 3D scenes with View Transitions or GSAP timeline.
- **Performance Budget**: Design within constraints — 50k polygons per model, textures ≤ 2048×2048, target 60fps desktop / 30fps mobile. Use LOD (Level of Detail) when objects are distant. Instancing for repeated geometry.
- **Fallback Design**: Always design a graceful static fallback (poster image or CSS illustration) for browsers where WebGL is unavailable or too slow.

**CRITICAL for 3D**: The "aesthetic direction" must unify both the 3D scene and the 2D HTML overlay. A brutalist 2D UI clashes with a soft organic 3D scene — commit to one visual language across both layers.

### Portfolio Variant: Isometric Miniature World

When building a **personal portfolio website with an interactive 3D diorama**, apply this specific design language on top of the general 3D guidelines above.

**Core Style Keywords**: Stylized Low-poly · Isometric Miniature World · Interactive 3D Diorama · Soft Matte / Clay-like Materials · Cozy, Playful, Minimalist · Soft Ambient Lighting · Muted Pastel Color Palette

**What this style IS**: A refined, warm, character-filled digital scale model — precise geometry, clear spatial depth, toy-model proportions with slightly rounded edges.

**What to avoid**: Photorealism, dense/complex geometry, strong neon colors, high-specular materials, sci-fi game aesthetics.

#### Visual Direction

- Camera: Isometric / Orthographic, 30–45° bird's-eye view. Prefer `OrthographicCamera` in R3F.
- Geometry: Simplified forms with clear volumetric depth. Edges slightly rounded. Proportions skew toward toy/model scale.
- Materials: Matte/clay-like (`roughness: 0.85–1.0`, `metalness: 0.0–0.05`). No high-gloss surfaces. Flat-shaded or smooth-shaded with minimal specular.
- Lighting: Soft ambient fill + one directional "sun" light at low angle. Add contact shadows (`<ContactShadows>` from Drei) for grounding. Avoid harsh shadows.
- Color Palette: Muted pastels with deliberate warm neutrals. 3–4 dominant hues, no saturated neons. Maintain consistency across all scene objects.
- Composition: Meaningful whitespace — do NOT pack the scene. Each zone (About / Projects / Experience / Skills / Contact) should breathe.

#### UI Design (2D Overlay on 3D)

- 3D scene is the visual hero; 2D UI is a clean information layer.
- Sans-serif typography, light/regular weight. Match roundedness and color of the 3D scene.
- Info panels: translucent light background (`bg-white/80 backdrop-blur-sm`), soft border-radius that echoes model proportions.
- Navigation: fixed overlay, always accessible — user must NOT depend on 3D interaction to reach content.
- Color, corner radius, and spacing must be consistent between 2D UI and 3D scene.
- Never looks like a game HUD.

#### Design Principles

1. The 3D scene is a narrative medium, not decoration — every object represents a portfolio section.
2. Keep low-poly simplicity. Resist adding mesh detail beyond what readability requires.
3. Prioritize visual consistency, smooth operation, and spatial hierarchy.
4. Balance Playful and Professional — warm and distinctive, not childish or corporate.
5. Portfolio content must be easy to find, read, and understand — interaction is enhancement, not gating.
6. All motion effects should be restrained; never block reading or distract from content.
7. Support Reduced Motion and provide a non-WebGL fallback path for core content.

