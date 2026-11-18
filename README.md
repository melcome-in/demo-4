# MELCOME – THE BLUE DOOR
### Cinematic 3D Destination Wedding Invitation Experience

An interactive, photorealistic 3D destination wedding invitation experience engineered with **React 18 + Vite + TypeScript + Three.js + React Three Fiber + Drei + Custom GLSL Ocean Water Shaders + GSAP + Framer Motion + Lenis + Tailwind CSS**.

---

## Experience Flow

`THE BLUE DOOR → DOOR OPENING SHOT → WEDDING ENTRANCE AISLE → OCEAN-FACING WEDDING STAGE (180° ORBIT) → AERIAL OCEAN DRONE VIEW → COUPLE INTRODUCTION → OUR LOVE STORY → WEDDING CELEBRATION → COUNTDOWN → CINEMATIC GALLERY → RSVP CONCIERGE → SUNSET FINALE`

1. **Opening Experience – The Blue Door (`BlueDoorEntrance.tsx` & `OpeningBlueDoorHero.tsx`)**
   - Full-screen 3D Mediterranean-tropical villa entrance featuring white limewashed masonry, overhanging 3D magenta bougainvillea clusters, swaying tropical palms, terracotta planters, and UV-calibrated 3D weathered Aegean-blue wooden double doors with sculpted brass handles.
   - Displays `"Some beautiful moments deserve a beautiful beginning."` and `[ OPEN YOUR INVITATION ]`.
   - Clicking `[ OPEN YOUR INVITATION ]` triggers a single continuous 5.1-second GSAP camera shot:
     1. Camera glides toward the blue doors.
     2. Both 3D brass door handles physically rotate downward with a subtle latch sound.
     3. Both blue doors swing inward (`±104°`) as volumetric golden sunlight beams spill through the opening.
     4. The camera flies straight through the open doorway into the sunlit tropical resort.

2. **Wedding Entrance – The Destination (`WeddingAisleSection.tsx`)**
   - White flagstone pathway lined with white roses, cascading phalaenopsis orchids, magenta bougainvillea garlands, four billowing sheer white silk floral arches, swaying coconut palms, and flickering brass candle lanterns.
   - Displays `"Welcome to our little paradise"` and `[BRIDE NAME] & [GROOM NAME]`.

3. **Main Wedding Stage – The Showstopper (`MainWeddingStage.tsx` & `MainStageSection.tsx`)**
   - Elevated white beachfront deck and four-poster floral mandap with an ocean-facing circular floral arch, champagne silk drapery, crystal chandelier, and white guest seating facing the turquoise lagoon.
   - Includes a **cinematic 180-degree orbital camera sweep** around the stage and interactive camera angle presets (`180° Ocean Orbit`, `Aisle Front View`, `Photographer's Close-Up Study`).

4. **Cinematic Ocean Drone Experience (`OceanDroneSection.tsx`)**
   - Camera ascends to 48m drone altitude and pulls back over the beach cove, palm grove, white villa, and turquoise ocean waves.
   - Seamless blend between real-time 3D WebGL architecture/ocean shaders and 8K DJI Inspire aerial coastline plates (`aerial-drone-coast.jpg`).
   - Displays `"Two hearts. One beautiful journey."`

5. **Editorial & Interactive Chapters**
   - **Couple Introduction**: `[BRIDE NAME] & [GROOM NAME]` — *"Together with our families, we invite you to celebrate our wedding."*
   - **Our Love Story**: 5-chapter visual timeline (*How We Met*, *Our First Memories*, *Special Moments*, *The Proposal*, *Our Wedding Day*).
   - **Wedding Celebration**: *Mehndi Ceremony*, *Wedding Ceremony*, and *Starlight Reception* with dates, times, venues, dress code swatches, `.ics` calendar downloads, Google Maps links, and live 3D sky lighting previews.
   - **Countdown Experience**: Live `Days | Hours | Minutes | Seconds` in a refractive ocean-glass shrine.
   - **Cinematic Gallery**: Featured 8K aerial frame, filterable Masonry gallery, and full-screen Lightbox with smooth zoom.
   - **RSVP Concierge**: Persistent reservation form with optional webhook endpoint (`VITE_RSVP_WEBHOOK_URL`) and downloadable digital **Villa Sanctuary Boarding Pass**.
   - **Final Sunset Experience**: Twilight shoreline view with floating sky lanterns, `"We can't wait to celebrate with you."`, `[BRIDE NAME] & [GROOM NAME]`, final RSVP CTA, and Blue Door replay.

---

## Running Locally

```bash
npm install
npm run dev
```
