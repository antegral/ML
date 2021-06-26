import { generate } from "text-to-image";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { randomSet } from "./textSample.json";
import sharp from "sharp";

declare const window: any;

export default class MLCaptcha {
  private regex: RegExp;
  private alignStrings: Array<"left" | "start" | "center" | "right" | "end">;
  private vartAlignStrings: Array<"center" | "top">;
  private phase: 1 | 2 | 3;

  constructor(phase: 1 | 2 | 3) {
    this.phase = phase;
    this.regex = /^data:.+\/(.+);base64,(.*)$/;
    this.alignStrings = ["left", "start", "center", "right", "end"];
    this.vartAlignStrings = ["center", "top"];
    mkdirSync(join(__dirname, `../output`, `/phase${phase}`));
    console.log(`MLCaptcha generate captcha for >> PHASE ${this.phase} <<`);
  }

  generateRandomString() {
    let latterStorage = "";
    switch (this.phase) {
      case 1:
        for (let i = 0; i < 8; i++) {
          let selectNumber = Math.floor(Math.random() * 72);
          latterStorage = `${latterStorage}${randomSet.phases.first[selectNumber]}`;
        }
        // console.log(`generateRandomString > latterStorage > ${latterStorage}`);
        return latterStorage;
      case 2:
        for (let i = 0; i < 8; i++) {
          let selectNumber = Math.floor(Math.random() * 92);
          latterStorage = `${latterStorage}${randomSet.phases.second[selectNumber]}`;
        }
        // console.log(`generateRandomString > latterStorage > ${latterStorage}`);
        return latterStorage;
      case 3:
        for (let i = 0; i < 8; i++) {
          let selectNumber = Math.floor(Math.random() * 92);
          latterStorage = `${latterStorage}${randomSet.phases.second[selectNumber]}`;
        }
        // console.log(`generateRandomString > latterStorage > ${latterStorage}`);
        return latterStorage;
      default:
    }
  }

  generateTextImage() {
    let originString = this.generateRandomString();
    console.log(`generateRandomString > ${originString}`);
    let align = this.alignStrings[Math.floor(Math.random() * 5)];
    let vartAlign = this.vartAlignStrings[Math.floor(Math.random() * 2)];
    return generate(originString, {
      debug: false,
      maxWidth: 700,
      customHeight: 250,
      fontSize: 130,
      fontFamily: "D2Coding ligature",
      lineHeight: 30,
      margin: 40,
      textAlign: align,
      bgColor: "white",
      verticalAlign: vartAlign,
      textColor: "black",
    }).then((b64: string) => {
      let matches = b64.match(this.regex);
      let data = matches[2];
      let buffer = Buffer.from(data, "base64");
      // let convertedData = new Uint8Array(Buffer.from(data));
      writeFileSync(
        join(
          __dirname,
          `../output`,
          `/phase${this.phase}/`,
          `${originString}.png`
        ),
        buffer
      );
      console.log(
        `generateTextImage > Generated and saved file. (Phase${this.phase}, ${originString}, ${align}, ${vartAlign})`
      );
      return originString;
    });
  }

  generateTextLineImage() {
    this.generateTextImage().then((originString) => {
      switch (this.phase) {
        case 1:
          this.lineProcesser(originString);
          break;
        case 2:
          this.lineProcesser(originString);
          break;
        case 3:
          this.lineProcesser(originString)
            .then(() => {
              this.lineProcesser(originString);
            })
            .then(() => {
              this.lineProcesser(originString);
            });
          break;
        default:
          break;
      }
    });
  }

  lineProcesser(originString: string) {
    return sharp(
      join(
        __dirname,
        `../output`,
        `/phase${this.phase}/`,
        `${originString}.png`
      )
    )
      .composite([
        {
          input: join(
            __dirname,
            `../layers/`,
            `layerSample${Math.floor(Math.random() * 15) + 1}.png`
          ),
        },
      ])
      .png()
      .toBuffer()
      .then((buffer: Buffer) => {
        writeFileSync(
          join(
            __dirname,
            `../output`,
            `/phase${this.phase}/`,
            `${originString}.png`
          ),
          buffer
        );
        console.log(`lineProcesser > Processing Complete. (${originString})`);
      });
  }
}
/*
writeFile(
join(
  __dirname,
  `../output`,
  `/phase${this.phase}/`,
  `${originString}.png`
),
buffer,
() => {
  console.log(
    `generateTextLineImage > Processing Complete. (${originString})`
  );
}
);
*/

/*
  image
  .background(
    join(
      __dirname,
      `../output`,
      `/phase${this.phase}/`,
      `${originString}.png`
    )
  )
  .add(
    join(
      __dirname,
      `../layers/`,
      `layerSample${Math.floor(Math.random() * 15) + 1}.png`
    )
  )
  .draw((b64: string) => {
    let matches = b64.match(this.regex);
    let data = matches[2];
    let buffer = Buffer.from(data, "base64");
    // let convertedData = new Uint8Array(Buffer.from(data));

    writeFile(
      join(
        __dirname,
        `../output`,
        `/phase${this.phase}/`,
        `${originString}.png`
      ),
      buffer,
      () => {
        console.log(
          `lineProcesser > Processing Complete. (${originString})`
        );
      }
    );
  });
*/

/*
  .mergeImages([
    join(
      __dirname,
      `../output`,
      `/phase${this.phase}/`,
      `${originString}.png`
    ),
    join(
      __dirname,
      `../layers/`,
      `layerSample${Math.floor(Math.random() * 15) + 1}.png`
    ),
  ])
  .then((b64: string) => {
    let matches = b64.match(this.regex);
    let data = matches[2];
    let buffer = Buffer.from(data, "base64");
    // let convertedData = new Uint8Array(Buffer.from(data));

    writeFile(
      join(
        __dirname,
        `../output`,
        `/phase${this.phase}/`,
        `${originString}.png`
      ),
      buffer,
      () => {
        console.log(
          `lineProcesser > Processing Complete. (${originString})`
        );
      }
    );
  });
*/
/*
          return got("http://image-merger.herokuapp.com/api/v1.0/", {
            json: {
              foreground_url: "asd",
            },
          })
            .then((res) => {
              return JSON.parse(res.body).output_image.base64;
            })
            .then((b64: string) => {
              let matches = b64.match(this.regex);
              let data = matches[2];
              let buffer = Buffer.from(data, "base64");

*/
