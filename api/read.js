import OpenAI from "openai";


/* =========================================================
   SETTINGS
========================================================= */

const MODEL =
  "gpt-5.4-mini";


/*
  GPT-5.4 mini current API pricing

  Input:
  $0.75 / 1,000,000 tokens

  Output:
  $4.50 / 1,000,000 tokens
*/

const INPUT_PRICE =
  0.75 / 1_000_000;

const OUTPUT_PRICE =
  4.50 / 1_000_000;


/* =========================================================
   MAJOR ARCANA
========================================================= */

const CARDS = [

  {
    id:0,
    name:"The Fool",
    file:"fool.jpg",
    core:
      "beginning, openness, leap, possibility, trust, movement into the unknown"
  },

  {
    id:1,
    name:"The Magician",
    file:"magician.jpg",
    core:
      "initiative, ability, action, focus, turning possibility into reality"
  },

  {
    id:2,
    name:"The High Priestess",
    file:"high-priestess.jpg",
    core:
      "intuition, hidden information, silence, inner knowing, what is not yet revealed"
  },

  {
    id:3,
    name:"The Empress",
    file:"empress.jpg",
    core:
      "growth, care, abundance, attraction, allowing something to develop"
  },

  {
    id:4,
    name:"The Emperor",
    file:"emperor.jpg",
    core:
      "structure, boundaries, stability, control, taking responsibility"
  },

  {
    id:5,
    name:"The Hierophant",
    file:"hierophant.jpg",
    core:
      "values, guidance, tradition, learning, established ways"
  },

  {
    id:6,
    name:"The Lovers",
    file:"lovers.jpg",
    core:
      "choice, alignment, connection, values, meaningful attraction"
  },

  {
    id:7,
    name:"The Chariot",
    file:"chariot.jpg",
    core:
      "movement, direction, determination, forward momentum, control"
  },

  {
    id:8,
    name:"Strength",
    file:"strength.jpg",
    core:
      "inner strength, patience, courage, gentle control, emotional steadiness"
  },

  {
    id:9,
    name:"The Hermit",
    file:"hermit.jpg",
    core:
      "withdrawal, reflection, solitude, searching for inner clarity"
  },

  {
    id:10,
    name:"Wheel of Fortune",
    file:"wheel.jpg",
    core:
      "change, cycles, turning point, movement beyond current control"
  },

  {
    id:11,
    name:"Justice",
    file:"justice.jpg",
    core:
      "truth, balance, consequences, clarity, seeing things as they are"
  },

  {
    id:12,
    name:"The Hanged Man",
    file:"hanged.jpg",
    core:
      "pause, waiting, suspension, surrender, new perspective, delayed movement"
  },

  {
    id:13,
    name:"Death",
    file:"death.jpg",
    core:
      "ending, transition, release, transformation, making space for what follows"
  },

  {
    id:14,
    name:"Temperance",
    file:"temperance.jpg",
    core:
      "balance, healing pace, integration, moderation, gradual movement"
  },

  {
    id:15,
    name:"The Devil",
    file:"devil.jpg",
    core:
      "attachment, fixation, temptation, fear, patterns that feel difficult to release"
  },

  {
    id:16,
    name:"The Tower",
    file:"tower.jpg",
    core:
      "sudden disruption, revelation, collapse of what is unstable, truth breaking through"
  },

  {
    id:17,
    name:"The Star",
    file:"star.jpg",
    core:
      "hope, renewal, openness, guidance, gentle recovery, future possibility"
  },

  {
    id:18,
    name:"The Moon",
    file:"moon.jpg",
    core:
      "uncertainty, ambiguity, intuition, hidden fears, incomplete information"
  },

  {
    id:19,
    name:"The Sun",
    file:"sun.jpg",
    core:
      "clarity, openness, vitality, confidence, visible truth, positive movement"
  },

  {
    id:20,
    name:"Judgement",
    file:"judgement.jpg",
    core:
      "awakening, realization, reckoning, response, a call to move forward"
  },

  {
    id:21,
    name:"The World",
    file:"world.jpg",
    core:
      "completion, integration, closure, arrival, transition to a new cycle"
  }

];


/* =========================================================
   IMAGE LOCATION
========================================================= */

const IMAGE_BASE =
  "https://raw.githubusercontent.com/oneera1991-cyber/stillwater-ceremony/main/cards/web/";


/* =========================================================
   AI — QUESTION ANALYZER
========================================================= */

const ANALYZER_INSTRUCTIONS = `

You are the private question-listening intelligence
inside Stillwater Universe.

Your job is NOT to predict the future.

Your job is to understand the human being behind
the user's question.

Analyze the question so Vera can later interpret
a tarot card specifically for this person.

Return JSON ONLY.

Required fields:

intent
emotional_state
emotional_intensity
situation
core_need
reading_angle
key_signals

Rules:

1. Answer in Thai.

2. Be concise.

3. Do not write an essay.

4. Do not invent facts that are not present.

5. Do not claim certainty about another person's
   private thoughts or intentions.

6. Detect whether the person seems:

- curious
- hopeful
- anxious
- sad
- confused
- pressured
- attached
- afraid
- uncertain
- simply exploratory

7. Detect important signals such as:

- waiting
- silence
- communication
- approach
- distance
- return
- beginning
- ending
- transition
- clarity
- uncertainty
- decision
- obstacle
- opportunity
- movement
- stillness

8. Do not force the question into a category
such as love, work, money or health unless
the user clearly indicates it.

9. emotional_intensity MUST be exactly one of:

low
medium
high

10. key_signals should contain only 2-5 short
Thai phrases.

11. The analysis is internal.
Do not speak directly to the user.

Return valid JSON only.

`;


/* =========================================================
   AI — VERA READING
========================================================= */

const READER_INSTRUCTIONS = `

You are Vera,
the reading voice inside Stillwater Universe.

Your task is to give the user a concise,
emotionally intelligent tarot reading.

The user has asked one question.

A Major Arcana card has already been drawn.

You must interpret the card specifically
for this person's question and emotional state.

IMPORTANT:

The card was randomly drawn.

You MUST NOT choose or change the card.

You MUST preserve the core meaning of the card.

Do not invent unrelated meanings.

Do not flatter the user.

Do not tell the user only what they want to hear.

Do not guarantee future events.

Do not state another person's private thoughts
as fact.

Do not say:

"ถ้าถามเรื่องความรัก..."
"ถ้าถามเรื่องงาน..."
"ถ้าถามเรื่องเงิน..."

Do not organize the answer into categories.

Instead, speak naturally as if Vera is directly
speaking to the person.

Look for relevant signals such as:

movement
stillness
waiting
approach
distance
contact
silence
clarity
uncertainty
beginning
ending
transition
opportunity
obstacle

If the user seems emotionally distressed,
be gentle and grounded.

Do not diagnose medical conditions.

Do not give dangerous advice.

MOST IMPORTANT:

This is a FREE READING.

The answer should feel meaningful,
specific and emotionally intelligent,
but it must remain concise.

Target approximately:

150-220 Thai words.

Do not exceed the available output limit.

Structure the answer naturally around:

1. What the card is showing about
   the situation.

2. The strongest signal the user
   should notice.

3. What the current direction seems
   to be asking the user to understand.

4. A short closing sentence that gives
   the reading a sense of completion.

Do not repeat the same idea.

Do not explain the textbook meaning
of the tarot card at length.

Do not write a long introduction.

Do not use headings.

Do not mention AI.

Do not mention this instruction.

`;


/* =========================================================
   PICK ONE CARD
========================================================= */

function pickCard(){

  const index =
    Math.floor(
      Math.random() *
      CARDS.length
    );

  return CARDS[index];

}


/* =========================================================
   PARSE JSON
========================================================= */

function jsonFromText(text){

  try{

    return JSON.parse(text);

  }catch(error){

    const match =
      text.match(
        /\{[\s\S]*\}/
      );

    if(match){

      return JSON.parse(
        match[0]
      );

    }

    throw new Error(
      "AI returned invalid JSON"
    );

  }

}


/* =========================================================
   API HANDLER
========================================================= */

export default async function handler(
  req,
  res
){

  /* ---------------------------------------
     METHOD
  --------------------------------------- */

  if(req.method !== "POST"){

    return res
      .status(405)
      .json({
        error:
          "Method not allowed"
      });

  }


  try{

    /* ---------------------------------------
       QUESTION
    --------------------------------------- */

    const {
      question
    } = req.body || {};


    if(
      typeof question !== "string"
      ||
      question.trim().length < 3
    ){

      return res
        .status(400)
        .json({
          error:
            "กรุณาใส่คำถามก่อน"
        });

    }


    if(
      question.length > 1200
    ){

      return res
        .status(400)
        .json({
          error:
            "คำถามยาวเกินไปสำหรับ Prototype"
        });

    }


    /* ---------------------------------------
       API KEY
    --------------------------------------- */

    if(
      !process.env.OPENAI_API_KEY
    ){

      return res
        .status(500)
        .json({
          error:
            "ยังไม่ได้ตั้งค่า OPENAI_API_KEY ใน Vercel"
        });

    }


    /* ---------------------------------------
       OPENAI
    --------------------------------------- */

    const client =
      new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY
      });


    /* =================================================
       STEP 1
       LISTEN TO THE HUMAN
    ================================================= */

    const analysisResponse =
      await client.responses.create({

        model:
          MODEL,

        instructions:
          ANALYZER_INSTRUCTIONS,

        input:
          question.trim(),

        /*
          IMPORTANT:

          Maximum AI analysis output
          = 300 tokens
        */

        max_output_tokens:
          300

      });


    const analysis =
      jsonFromText(
        analysisResponse.output_text
      );


    /* =================================================
       STEP 2
       DRAW CARD
    ================================================= */

    const card =
      pickCard();


    /* =================================================
       STEP 3
       VERA READS THE CARD
    ================================================= */

    const readerInput =
      JSON.stringify({

        user_question:
          question.trim(),

        question_analysis:
          analysis,

        drawn_card:{

          name:
            card.name,

          core_meaning:
            card.core

        }

      });


    const readingResponse =
      await client.responses.create({

        model:
          MODEL,

        instructions:
          READER_INSTRUCTIONS,

        input:
          readerInput,

        /*
          IMPORTANT:

          Maximum FREE READING output
          = 500 tokens
        */

        max_output_tokens:
          500

      });


    /* =================================================
       USAGE
    ================================================= */

    const analysisUsage =
      analysisResponse.usage || {};


    const readingUsage =
      readingResponse.usage || {};


    const analysisInputTokens =
      analysisUsage.input_tokens || 0;


    const analysisOutputTokens =
      analysisUsage.output_tokens || 0;


    const readingInputTokens =
      readingUsage.input_tokens || 0;


    const readingOutputTokens =
      readingUsage.output_tokens || 0;


    const totalTokens =

      analysisInputTokens +

      analysisOutputTokens +

      readingInputTokens +

      readingOutputTokens;


    const estimatedUSD =

      (
        analysisInputTokens +
        readingInputTokens
      )
      *
      INPUT_PRICE

      +

      (
        analysisOutputTokens +
        readingOutputTokens
      )
      *
      OUTPUT_PRICE;


    /* =================================================
       RESPONSE
    ================================================= */

    return res
      .status(200)
      .json({

        analysis,

        card:{

          id:
            card.id,

          name:
            card.name,

          image:
            IMAGE_BASE +
            card.file

        },

        reading:
          readingResponse.output_text,

        usage:{

          analysis_input_tokens:
            analysisInputTokens,

          analysis_output_tokens:
            analysisOutputTokens,

          reading_input_tokens:
            readingInputTokens,

          reading_output_tokens:
            readingOutputTokens,

          total_tokens:
            totalTokens,

          estimated_usd:
            estimatedUSD

        }

      });


  }catch(error){

    console.error(
      "Stillwater AI Error:",
      error
    );


    return res
      .status(500)
      .json({

        error:
          error?.message ||
          "เกิดข้อผิดพลาดจาก AI"

      });

  }

}
