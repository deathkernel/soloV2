import { useState, useRef } from "react";
import NavBar from "../components/NavBar";

/* ══════════════════════════════════════════
   ALL BOXING MOVES — Complete Reference
══════════════════════════════════════════ */

const MOVES_DATA = {

  /* ── PUNCHES ── */
  punches: {
    label: "PUNCHES",
    icon: "🥊",
    color: "#ff4444",
    moves: [
      {
        id: "p1", number: "1", name: "JAB",
        hand: "LEFT", difficulty: "BASIC",
        desc: "Seedha left hand se fast punch. Setup punch — yahi se sab shuru hota hai.",
        howTo: ["Orthodox stance — left foot aage", "Left hand seedha extend karo", "Fist end pe rotate karo (knuckles neeche)", "Turant wapas guard pe aao"],
        tips: "Speed > Power. Jab distance banata hai aur combos setup karta hai.",
        usedIn: ["1-2", "1-2-3", "1-2-slip-2", "Double Jab (1-1-2)"],
      },
      {
        id: "p2", number: "2", name: "CROSS",
        hand: "RIGHT", difficulty: "BASIC",
        desc: "Right hand se powerful straight punch. Main power punch.",
        howTo: ["Right hip rotate karo explosively", "Right shoulder naturally aage aaye", "Right hand seedha extend karo", "Left guard face ke paas rakho"],
        tips: "Power legs se generate hoti hai — sirf arm mat ghuma.",
        usedIn: ["1-2", "1-2-3", "3-2-3", "1-2-3-2"],
      },
      {
        id: "p3", number: "3", name: "LEFT HOOK",
        hand: "LEFT", difficulty: "BASIC",
        desc: "Left hand se curved punch — side se aata hai. KO punch.",
        howTo: ["Left elbow 90 degree pe bend karo", "Left foot pe pivot (toe inward)", "Hip aur shoulder ek saath rotate karo", "Fist horizontal — palm neeche"],
        tips: "Elbow drop mat karo. Poori body ek unit ki tarah ghume.",
        usedIn: ["1-2-3", "3-2-3", "Double Jab + Hook"],
      },
      {
        id: "p4", number: "4", name: "RIGHT HOOK",
        hand: "RIGHT", difficulty: "INTERMEDIATE",
        desc: "Right hand se curved punch. Bahut powerful — lekin guard khulta hai.",
        howTo: ["Right elbow 90 degree pe", "Right foot pe pivot karo", "Explosive hip rotation", "Target side se hit hoga"],
        tips: "1-2 ke baad use karo. Akela right hook risky hai.",
        usedIn: ["Advanced combos", "Freestyle rounds"],
      },
      {
        id: "p5", number: "5", name: "LEFT UPPERCUT",
        hand: "LEFT", difficulty: "INTERMEDIATE",
        desc: "Left hand se neeche se upar punch. Close range pe devastating.",
        howTo: ["Left knee thoda bend karo (dip)", "Left hip explode upar ki taraf", "Arm scoop motion mein aaye", "Knuckles upar face karein"],
        tips: "Legs se power generate karo. Body drive karo sirf arm nahi.",
        usedIn: ["Body-head combos", "Inside fighting"],
      },
      {
        id: "p6", number: "6", name: "RIGHT UPPERCUT",
        hand: "RIGHT", difficulty: "INTERMEDIATE",
        desc: "Right hand se neeche se upar. Chin pe land ho toh game over.",
        howTo: ["Right side thoda dip karo", "Right hip explosive rotation upar", "Palm apni taraf face kare", "Chin ya body pe aim karo"],
        tips: "Body shot ke baad bahut effective — pehle 5/6 body, phir head.",
        usedIn: ["Power combinations", "Counter punching"],
      },
      {
        id: "p7", number: "7", name: "LEAD BODY HOOK",
        hand: "LEFT", difficulty: "INTERMEDIATE",
        desc: "Left hook lekin body pe maaro — liver shot. Round ender.",
        howTo: ["Normal left hook motion", "Aim neeche karo — ribcage pe", "Thoda crouch karo", "Left liver ko target karo"],
        tips: "Liver shot ka effect delayed hota hai. Ek accha shot 10 sec baad kaam karta hai.",
        usedIn: ["3-2-3 body-head", "Body work setups"],
      },
      {
        id: "p8", number: "8", name: "REAR BODY HOOK",
        hand: "RIGHT", difficulty: "INTERMEDIATE",
        desc: "Right hook body pe — solar plexus ya liver right side.",
        howTo: ["Right hook bend karo", "Neeche aim karo body pe", "Dip karo attack ke waqt", "Hip rotation same rahegi"],
        tips: "Guard low karne pe force karta hai — phir head pe aao.",
        usedIn: ["Body combinations", "Setup punches"],
      },
      {
        id: "p9", number: "OVERHAND", name: "OVERHAND RIGHT",
        hand: "RIGHT", difficulty: "ADVANCED",
        desc: "Upar se neeche ka curved punch — guard ke upar se aata hai.",
        howTo: ["Normal cross se shuru karo", "Arm slightly upar se arc karo", "Shoulder rotate fully", "Opponent ke guard ke bahar se land karo"],
        tips: "Southpaw ke against ya tall opponent ke liye best. Risky — guard khulta hai.",
        usedIn: ["Advanced combos", "Counter attacks"],
      },
      {
        id: "p10", number: "SUPERMAN", name: "SUPERMAN PUNCH",
        hand: "RIGHT", difficulty: "ADVANCED",
        desc: "Jump karke right hand punch. Reach badhaata hai — element of surprise.",
        howTo: ["Left foot se small jump karo", "Saath mein right hand punch karo", "Extend fully mid-air", "Land karo balance ke saath"],
        tips: "Sparingly use karo — zyada predictable ho jata hai. Setup karo first.",
        usedIn: ["Surprise attacks", "Southpaw matchups"],
      },
    ]
  },

  /* ── DEFENSE ── */
  defense: {
    label: "DEFENSE",
    icon: "🛡",
    color: "#00ffcc",
    moves: [
      {
        id: "d1", number: "SLIP", name: "SLIP",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Head ko side mein move karo incoming punch miss karane ke liye.",
        howTo: ["Punch aate dekho", "Head right ya left move karo — duck nahi", "Knees slightly bend karo", "Counter punch ready rakho turant"],
        tips: "Slip karo aur TURANT counter karo. Opponent open hota hai slip ke baad.",
        usedIn: ["1-2-slip-2", "Counter fighting style"],
      },
      {
        id: "d2", number: "BOB", name: "BOB & WEAVE",
        hand: "DEFENSE", difficulty: "INTERMEDIATE",
        desc: "Neeche duck karo aur side se nikal jao. Hook se bachne ka best tarika.",
        howTo: ["Knees bend karo neeche jaane ke liye", "Head U-shape mein move karo", "Ek side se dusri side nikal jao", "Counter position pe aa jao"],
        tips: "Kamar se mat jhuko — knees se. Back straight rakho.",
        usedIn: ["Hook defense", "Inside fighting entry"],
      },
      {
        id: "d3", number: "PARRY", name: "PARRY",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Opponent ke punch ko hath se redirect karo. Simple aur effective.",
        howTo: ["Opponent ke punch aate dekho", "Apne lead hand se uski wrist/forearm ko side mein push karo", "Sirf redirect karo — block nahi", "Immediately counter attack karo"],
        tips: "Zyada force mat lagao parry mein — sirf guide karo punch ko.",
        usedIn: ["Jab defense", "Counter fighting"],
      },
      {
        id: "d4", number: "BLOCK", name: "HIGH GUARD BLOCK",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Gloves ko face ke paas rakho punches absorb karne ke liye.",
        howTo: ["Gloves ko cheekbone pe rakho", "Elbows neeche (body guard)", "Wrists tight rakho", "Guard ke through dekho"],
        tips: "Block se energy jati hai. Jab possible ho parry ya slip prefer karo.",
        usedIn: ["Pressure situations", "Corner defense"],
      },
      {
        id: "d5", number: "ROLL", name: "SHOULDER ROLL",
        hand: "DEFENSE", difficulty: "ADVANCED",
        desc: "Lead shoulder se incoming punch deflect karo. Floyd Mayweather style defense.",
        howTo: ["Lead shoulder rotate karo incoming punch ki taraf", "Hip slightly twist karo", "Punch shoulder pe slide ho jaata hai", "Immediately counter karo"],
        tips: "Floyd Mayweather ka signature move. Bahut practice chahiye.",
        usedIn: ["Counterpunching", "Cross defense"],
      },
      {
        id: "d6", number: "CLINCH", name: "CLINCH",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Opponent ko pakad lo damage rokne ke liye. Reset strategy.",
        howTo: ["Andar jaao", "Dono arms opponent ke arms ke upar wrap karo", "Body press karo", "Ref break karega — use karke recover karo"],
        tips: "Hurt hone pe ya combo rokne ke liye. Zyada use karo toh warning milti hai.",
        usedIn: ["Damage control", "Recovery moments"],
      },
      {
        id: "d7", number: "PULL BACK", name: "PULL BACK",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Upper body peeche lean karo punch miss karane ke liye.",
        howTo: ["Upper body peeche lean karo", "Weight rear foot pe shift karo", "Arms guard pe rakho", "Turant wapas neutral pe aao"],
        tips: "Zyada far mat jao — range bahar ho jaoge counter ke liye.",
        usedIn: ["Jab distance", "Bait and counter"],
      },
      {
        id: "d8", number: "DUCK", name: "DUCK",
        hand: "DEFENSE", difficulty: "BASIC",
        desc: "Neeche go karke swing miss karao. Hook ke against.",
        howTo: ["Knees bend karo quickly", "Head neeche aaye punch ke neeche", "Back straight rakho", "Wapas upar aao counter ke saath"],
        tips: "Bob & weave se alag — duck seedha neeche, weave side se nikalta hai.",
        usedIn: ["Hook defense", "Haymaker defense"],
      },
    ]
  },

  /* ── FOOTWORK ── */
  footwork: {
    label: "FOOTWORK",
    icon: "👟",
    color: "#ffaa00",
    moves: [
      {
        id: "f1", number: "STEP IN", name: "STEP IN",
        hand: "FOOTWORK", difficulty: "BASIC",
        desc: "Aage badho punch karne ke liye. Lead foot pehle aata hai.",
        howTo: ["Lead foot step aage karo", "Rear foot follow karo same distance", "Stance width maintain karo", "Balance kabhi mat kho"],
        tips: "Step aur punch saath mein karo — pehle step phir punch alag nahi hona chahiye.",
        usedIn: ["Jab setup", "Combination entry"],
      },
      {
        id: "f2", number: "STEP BACK", name: "STEP BACK",
        hand: "FOOTWORK", difficulty: "BASIC",
        desc: "Peeche jao range create karne ke liye. Rear foot pehle.",
        howTo: ["Rear foot peeche step karo", "Lead foot follow karo", "Maintain stance width", "Eyes opponent pe raho"],
        tips: "Corner mein straight mat step out karo — angle pe niklo.",
        usedIn: ["Range management", "After combinations"],
      },
      {
        id: "f3", number: "PIVOT", name: "PIVOT",
        hand: "FOOTWORK", difficulty: "INTERMEDIATE",
        desc: "Lead foot pe rotate karo — angle change karo. Bahut important move.",
        howTo: ["Lead foot pe weight rakho", "Rear foot se circle mein move karo", "90 ya 180 degree rotate kar sakte ho", "New angle pe face karo opponent"],
        tips: "Pivot ke baad turant attack karo — opponent vulnerable hoga.",
        usedIn: ["Angle creation", "Corner escape", "Counter setups"],
      },
      {
        id: "f4", number: "LATERAL", name: "LATERAL MOVEMENT",
        hand: "FOOTWORK", difficulty: "BASIC",
        desc: "Side pe move karo — left ya right. Straight line se baho.",
        howTo: ["Lead foot direction mein step karo", "Rear foot follow karo", "Feet cross mat karo", "Triangle movement maintain karo"],
        tips: "Straight line pe mat kharo — side movement se opponent confuse hota hai.",
        usedIn: ["Ring generalship", "Avoiding pressure"],
      },
      {
        id: "f5", number: "CIRCLE OUT", name: "CIRCLE OUT",
        hand: "FOOTWORK", difficulty: "INTERMEDIATE",
        desc: "Circle karte hue peeche jao — opponent ka angle kharaab karo.",
        howTo: ["Combination ke baad", "Pivot + step back combination karo", "Circle karo opponent ke power hand se door", "New position se reassess karo"],
        tips: "Circle opponent ke jab side pe — uski right (power) hand se door jao.",
        usedIn: ["Pressure escape", "Ring control"],
      },
      {
        id: "f6", number: "SWITCH", name: "STANCE SWITCH",
        hand: "FOOTWORK", difficulty: "ADVANCED",
        desc: "Orthodox se southpaw ya vice versa switch karo mid-fight.",
        howTo: ["Feet quickly swap karo", "Weight transfer smoothly karo", "Guard adjust karo new stance ke liye", "Immediately attack ya defend"],
        tips: "Switch se opponent confuse hota hai. Only switch if comfortable in both stances.",
        usedIn: ["Deception", "Creating angles"],
      },
    ]
  },

  /* ── ADVANCED TECHNIQUES ── */
  advanced: {
    label: "ADVANCED",
    icon: "⚡",
    color: "#cc44ff",
    moves: [
      {
        id: "a1", number: "FEINT", name: "FEINT",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Fake punch dike jaane ki tarah karo — opponent ko react karao phir real punch karo.",
        howTo: ["Partial punch motion shuru karo", "Stop karo midway", "Opponent react karega (guard move ya flinch)", "Turant real punch karo opening mein"],
        tips: "Feint tabhi kaam karta hai jab pehle real punches land ki hoon.",
        usedIn: ["Setup combinations", "Creating openings"],
      },
      {
        id: "a2", number: "COUNTER", name: "COUNTER PUNCHING",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Opponent ke punch ke saath ya turant baad punch karo. Timing ka game.",
        howTo: ["Slip/parry/roll karo incoming punch", "Opening dekho (opponent extended hai)", "Turant counter karo — speed essential hai", "Wapas guard pe jao"],
        tips: "Counter punch ka timing perfect hona chahiye. Miss karo toh tum exposed ho.",
        usedIn: ["Defensive fighting style", "Bait and counter"],
      },
      {
        id: "a3", number: "LEVEL CHANGE", name: "LEVEL CHANGE",
        hand: "BOTH", difficulty: "INTERMEDIATE",
        desc: "Head se body ya body se head pe shift karo. Guard split karo.",
        howTo: ["Head pe 1-2 maaro", "Opponent guard upar aaye", "Dip karo body pe", "Body pe maaro phir wapas head"],
        tips: "Guard ek jagah pe reh nahi sakta — level change force karta hai split decisions.",
        usedIn: ["3-2-3 body-head", "All advanced combos"],
      },
      {
        id: "a4", number: "PRESSURE", name: "PRESSURE FIGHTING",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Constantly aage badho — opponent ko ring pe trap karo. Aggression style.",
        howTo: ["Constant forward movement rakho", "Head movement karo while advancing", "Short punches jab inside hao", "Corner mein trap karo"],
        tips: "Head movement essential hai ya tu bhi hit hoga. Chin down rakho.",
        usedIn: ["Aggressive style", "Shorter vs taller fighters"],
      },
      {
        id: "a5", number: "INFIGHTING", name: "INSIDE / INFIGHTING",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Close range mein fight karo — short hooks, uppercuts, body shots.",
        howTo: ["Andar jaao safely (slip + step)", "Short compact punches maaro", "Head movement essential", "Clinch agar overwhelmed ho"],
        tips: "Tall opponents ke against effective. Short punches inside pe zyada powerful hote hain.",
        usedIn: ["Clinch range", "Counter to jab-cross fighters"],
      },
      {
        id: "a6", number: "BAIT", name: "BAIT & DRAW",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Intentionally opening dikhao opponent ko punch karne ke liye — counter karo.",
        howTo: ["Intentional gap dikhao guard mein", "Opponent punch karne aaye", "Slip/parry karo quickly", "Counter punch landing spot pe"],
        tips: "Timing perfect hona chahiye. Amateurs ke against effective — pros see through it.",
        usedIn: ["Counter fighting", "Patience game"],
      },
      {
        id: "a7", number: "SOUTHPAW", name: "SOUTHPAW STANCE",
        hand: "SPECIAL", difficulty: "ADVANCED",
        desc: "Right foot aage, left hand power hand. Left-handed fighter ka natural stance.",
        howTo: ["Right foot lead mein rakho", "Left hand jab, right hand cross", "Angles alag hote hain orthodox se", "Lead foot outside pe rakho opponent ke lead foot se"],
        tips: "Southpaw vs Orthodox mein angles create karo — lead foot outside placement key hai.",
        usedIn: ["Natural southpaws", "Stance switching"],
      },
      {
        id: "a8", number: "RING CUTTING", name: "RING CUTTING",
        hand: "FOOTWORK", difficulty: "ADVANCED",
        desc: "Opponent ka ring mein space kam karo — corner mein trap karo.",
        howTo: ["Lateral movement block karo angle se", "Pivot karo opponent ke movement ke opposite", "Cut off escape routes", "Corner ya ropes pe force karo"],
        tips: "Ring generalship ka sabse important part. Space control = fight control.",
        usedIn: ["Pressure fighting", "Ring control"],
      },
    ]
  },

  /* ── COMBINATIONS ── */
  combos: {
    label: "COMBOS",
    icon: "💥",
    color: "#ff6600",
    moves: [
      {
        id: "c1", number: "1-2", name: "JAB-CROSS",
        hand: "BOTH", difficulty: "BASIC",
        desc: "Sabse basic combo. Foundation of all boxing.",
        howTo: ["Jab (1) — left hand seedha", "Immediately cross (2) — right hand power", "Return to guard", "Repeat with rhythm"],
        tips: "Speed aur rhythm pe focus karo. Yahi sab combos ki base hai.",
        usedIn: ["Every round", "Warmup", "All combos ki base"],
      },
      {
        id: "c2", number: "1-2-3", name: "JAB-CROSS-HOOK",
        hand: "BOTH", difficulty: "BASIC",
        desc: "Classic 3-punch combo. Cross ke baad opponent head move karta hai — hook wahan hota hai.",
        howTo: ["Jab (1) — distance check", "Cross (2) — power", "Left hook (3) — follow the head movement", "Exit with footwork"],
        tips: "Cross ke baad opponent head move karta hai — hook naturally wahan land hota hai.",
        usedIn: ["Round 3 – 1-2-3 ka matlab yahi hai"],
      },
      {
        id: "c3", number: "1-2-slip-2", name: "JAB-CROSS-SLIP-CROSS",
        hand: "BOTH", difficulty: "INTERMEDIATE",
        desc: "Combo karo, incoming punch dodge karo, phir counter cross.",
        howTo: ["Jab (1)", "Cross (2)", "Opponent ke counter ke liye slip karo", "Turant cross (2) counter pe"],
        tips: "Slip timing perfect honi chahiye. Pehle slowly practice karo phir speed.",
        usedIn: ["Round 4 – 1-2-slip-2 ka matlab yahi hai"],
      },
      {
        id: "c4", number: "3-2-3", name: "HOOK-CROSS-HOOK (Body-Head)",
        hand: "BOTH", difficulty: "INTERMEDIATE",
        desc: "Body pe hook, cross, phir head pe hook. Body shot guard neeche karta hai.",
        howTo: ["Lead hook body pe (3 body)", "Cross head pe (2)", "Lead hook head pe (3 head)", "Exit footwork"],
        tips: "Body shot guard split karta hai — upar wala hook easily land hota hai.",
        usedIn: ["Round 5 – 3-2-3 body-head ka matlab yahi hai"],
      },
      {
        id: "c5", number: "1-2-3-2", name: "JAB-CROSS-HOOK-CROSS",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Power combo. Last cross bahut hard land hota hai.",
        howTo: ["Jab (1)", "Cross (2)", "Hook (3) — opponent iske liye brace karta hai", "Cross (2) — surprise, lands hard"],
        tips: "Opponent 4th punch expect nahi karta. Yahi iska power hai.",
        usedIn: ["Round 6 – 1-2-3-2 power ka matlab yahi hai"],
      },
      {
        id: "c6", number: "1-1-2", name: "DOUBLE JAB-CROSS",
        hand: "BOTH", difficulty: "BASIC",
        desc: "Do jab se rhythm toda phir power cross.",
        howTo: ["Jab (1) — feeler", "Jab again (1) — different timing", "Cross (2) — full power", "Guard pe wapas"],
        tips: "Second jab different timing pe maaro — opponent first ke baad guard adjust karta hai.",
        usedIn: ["Round 7 – Double jab-cross-hook ka matlab yahi hai"],
      },
      {
        id: "c7", number: "1-6-3-2", name: "JAB-UPPERCUT-HOOK-CROSS",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "4-punch combo with level change. Jab se start, uppercut body khaolta hai.",
        howTo: ["Jab (1) — setup", "Right uppercut (6) — body ya chin", "Left hook (3) — head", "Cross (2) — finish"],
        tips: "Uppercut ke baad opponent guard adjust karta hai — hook aur cross wahan land hote hain.",
        usedIn: ["Advanced training", "Sparring"],
      },
      {
        id: "c8", number: "2-3-2", name: "CROSS-HOOK-CROSS",
        hand: "BOTH", difficulty: "INTERMEDIATE",
        desc: "Power combo — rear hand heavy combination.",
        howTo: ["Cross (2) — power punch", "Left hook (3) — keep pressure", "Cross (2) — finish strong", "Exit footwork"],
        tips: "Cross se start karna risky hai — use karo sirf jab opponent timing off ho.",
        usedIn: ["KO setups", "Brawling exchanges"],
      },
      {
        id: "c9", number: "5-2-3", name: "UPPERCUT-CROSS-HOOK",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Left uppercut se open karo phir power combo. Inside pe best.",
        howTo: ["Left uppercut (5) chin pe", "Cross (2) turant", "Left hook (3) finish karo", "Exit"],
        tips: "Close range pe devastating. Opponent ko no time to recover.",
        usedIn: ["Inside fighting", "Close range exchanges"],
      },
      {
        id: "c10", number: "1-2-5-2", name: "JAB-CROSS-UPPERCUT-CROSS",
        hand: "BOTH", difficulty: "ADVANCED",
        desc: "Setup karo phir body mein ja ke finish karo.",
        howTo: ["Jab (1) — range", "Cross (2) — head", "Left uppercut (5) — body ya chin", "Cross (2) — finish"],
        tips: "Ek level change wala combo. Bahut deceptive — head se body pe jaana unexpected hota hai.",
        usedIn: ["Round 8 – Freestyle aggressive ka ek example"],
      },
    ]
  },
};

/* ══════════════════════
   Move Card Component
══════════════════════ */
function MoveCard({ move, accentColor }) {
  const [img, setImg] = useState(null);
  const [open, setOpen] = useState(false);
  const fileRef = useRef();

  const diffColors = {
    BASIC: "#00aaff",
    INTERMEDIATE: "#ffaa00",
    ADVANCED: "#ff4444",
    SPECIAL: "#cc44ff",
  };

  return (
    <div style={{
      border: `1px solid ${accentColor}25`,
      background: "rgba(0,0,0,0.55)",
      borderRadius: "12px",
      padding: "18px",
      position: "relative",
    }}>
      {/* Number Badge */}
      <div style={{
        position: "absolute", top: "-13px", left: "16px",
        background: accentColor, color: "#000",
        fontWeight: "900", fontSize: "0.85rem",
        padding: "3px 12px", borderRadius: "20px", letterSpacing: "2px",
      }}>
        {move.number}
      </div>

      {/* Difficulty */}
      <div style={{
        position: "absolute", top: "10px", right: "10px",
        background: `${diffColors[move.difficulty]}18`,
        color: diffColors[move.difficulty],
        fontSize: "0.6rem", padding: "2px 7px", borderRadius: "10px",
        border: `1px solid ${diffColors[move.difficulty]}35`, letterSpacing: "1px",
      }}>
        {move.difficulty}
      </div>

      {/* Name + Hand */}
      <div style={{ marginTop: "10px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: accentColor, fontSize: "1.1rem", fontWeight: "800", letterSpacing: "2px" }}>
          {move.name}
        </span>
        <span style={{
          fontSize: "0.62rem", color: "#666",
          background: "rgba(255,255,255,0.05)",
          padding: "2px 7px", borderRadius: "6px",
        }}>
          {move.hand}
        </span>
      </div>

      {/* Description */}
      <p style={{ color: "#888", fontSize: "0.8rem", margin: "0 0 10px 0", lineHeight: "1.5" }}>
        {move.desc}
      </p>

      {/* Image Upload */}
      <div
        onClick={() => fileRef.current.click()}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1.5px dashed ${accentColor}30`,
          borderRadius: "8px",
          minHeight: "85px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", overflow: "hidden", marginBottom: "10px",
          position: "relative",
        }}
      >
        {img ? (
          <>
            <img src={img} alt={move.name} style={{ width: "100%", maxHeight: "180px", objectFit: "contain" }} />
            <div style={{
              position: "absolute", bottom: "5px", right: "7px",
              background: "rgba(0,0,0,0.75)", color: accentColor,
              fontSize: "0.62rem", padding: "2px 7px", borderRadius: "6px",
            }}>
              Change
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#3a3a3a" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "3px" }}>📷</div>
            <div style={{ fontSize: "0.7rem" }}>Reference image upload karo</div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => {
            const f = e.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = ev => setImg(ev.target.result);
            r.readAsDataURL(f);
          }}
        />
      </div>

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: `${accentColor}0d`,
          border: `1px solid ${accentColor}25`, color: accentColor,
          padding: "7px", borderRadius: "7px", cursor: "pointer",
          fontSize: "0.72rem", letterSpacing: "1px",
          marginBottom: open ? "10px" : 0,
        }}
      >
        {open ? "▲ CLOSE" : "▼ TECHNIQUE"}
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${accentColor}15`, paddingTop: "10px" }}>
          {/* Steps */}
          <div style={{ color: accentColor, fontSize: "0.65rem", letterSpacing: "2px", marginBottom: "7px" }}>
            KAISE KARO
          </div>
          {move.howTo.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
              <span style={{
                background: accentColor, color: "#000",
                width: "18px", height: "18px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", fontWeight: "700", flexShrink: 0, marginTop: "1px",
              }}>
                {i + 1}
              </span>
              <span style={{ color: "#bbb", fontSize: "0.78rem", lineHeight: "1.45" }}>{s}</span>
            </div>
          ))}

          {/* Tip */}
          <div style={{
            background: `${accentColor}0a`, border: `1px solid ${accentColor}25`,
            borderRadius: "7px", padding: "9px 11px", margin: "10px 0",
          }}>
            <span style={{ color: accentColor, fontSize: "0.65rem", letterSpacing: "1px" }}>TIP — </span>
            <span style={{ color: "#999", fontSize: "0.77rem" }}>{move.tips}</span>
          </div>

          {/* Used In */}
          {move.usedIn && move.usedIn.length > 0 && (
            <div>
              <div style={{ color: "#444", fontSize: "0.62rem", letterSpacing: "1px", marginBottom: "5px" }}>
                WORKOUT MEIN AATA HAI:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {move.usedIn.map((r, i) => (
                  <span key={i} style={{
                    background: "rgba(255,255,255,0.03)", color: "#666",
                    fontSize: "0.65rem", padding: "2px 7px",
                    borderRadius: "5px", border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════
   Main Page
══════════════════════ */
export default function CombatMoves({ onLogout }) {
  const [activeTab, setActiveTab] = useState("punches");

  const tabs = Object.entries(MOVES_DATA).map(([key, val]) => ({
    id: key, label: val.label, icon: val.icon, color: val.color,
  }));

  const current = MOVES_DATA[activeTab];
  const totalMoves = Object.values(MOVES_DATA).reduce((acc, cat) => acc + cat.moves.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingBottom: "80px" }}>
      <NavBar onLogout={onLogout} />

      {/* Header */}
      <div style={{
        textAlign: "center", padding: "28px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ color: "#3a3a3a", fontSize: "0.65rem", letterSpacing: "4px", marginBottom: "6px" }}>
          SHADOW MONARCH SYSTEM
        </div>
        <h1 style={{
          color: "#fff", fontSize: "1.6rem", fontWeight: "900",
          letterSpacing: "4px", margin: "0 0 5px 0",
        }}>
          COMBAT MOVES
        </h1>
        <p style={{ color: "#444", fontSize: "0.78rem", margin: 0 }}>
          {totalMoves} moves — Punches, Defense, Footwork, Advanced, Combos
        </p>
      </div>

      <div style={{ padding: "14px 16px 0" }}>

        {/* Quick Number Reference */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px", padding: "12px 14px", marginBottom: "14px",
        }}>
          <div style={{ color: "#555", fontSize: "0.62rem", letterSpacing: "2px", marginBottom: "8px" }}>
            MEANING OFBOXING NUMBERS
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { n: "1", name: "JAB", c: "#00aaff" },
              { n: "2", name: "CROSS", c: "#ff4444" },
              { n: "3", name: "L.HOOK", c: "#ffaa00" },
              { n: "4", name: "R.HOOK", c: "#ff6600" },
              { n: "5", name: "L.UPPER", c: "#cc44ff" },
              { n: "6", name: "R.UPPER", c: "#ff44aa" },
            ].map(item => (
              <div key={item.n} style={{
                background: `${item.c}10`, border: `1px solid ${item.c}28`,
                borderRadius: "7px", padding: "6px 10px", textAlign: "center",
                flex: "1", minWidth: "48px",
              }}>
                <div style={{ color: item.c, fontWeight: "900", fontSize: "1.1rem" }}>{item.n}</div>
                <div style={{ color: "#bbb", fontSize: "0.6rem" }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "5px", marginBottom: "16px",
          overflowX: "auto", paddingBottom: "4px",
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "0 0 auto",
                padding: "7px 12px",
                background: activeTab === tab.id ? `${tab.color}18` : "rgba(255,255,255,0.025)",
                border: activeTab === tab.id ? `1px solid ${tab.color}45` : "1px solid rgba(255,255,255,0.06)",
                color: activeTab === tab.id ? tab.color : "#555",
                borderRadius: "7px", cursor: "pointer",
                fontSize: "0.72rem", letterSpacing: "1px",
                fontWeight: activeTab === tab.id ? "700" : "400",
                whiteSpace: "nowrap",
              }}
            >
              {tab.icon} {tab.label}
              <span style={{
                marginLeft: "4px", fontSize: "0.62rem",
                color: activeTab === tab.id ? `${tab.color}aa` : "#333",
              }}>
                {MOVES_DATA[tab.id].moves.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "14px", paddingBottom: "10px",
          borderBottom: `1px solid ${current.color}18`,
        }}>
          <span style={{ fontSize: "1.3rem" }}>{current.icon}</span>
          <div>
            <div style={{ color: current.color, fontSize: "0.85rem", fontWeight: "700", letterSpacing: "2px" }}>
              {current.label}
            </div>
            <div style={{ color: "#444", fontSize: "0.68rem" }}>
              {current.moves.length} moves
            </div>
          </div>
        </div>

        {/* Move Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {current.moves.map(move => (
            <MoveCard key={move.id} move={move} accentColor={current.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
