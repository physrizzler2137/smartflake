import { File } from 'megajs';
import fs from 'fs';
import path from 'path';

const teamDir = path.join(process.cwd(), 'static', 'img', 'team');
const groupsDir = path.join(process.cwd(), 'static', 'img', 'groups');

if (!fs.existsSync(teamDir)) fs.mkdirSync(teamDir, { recursive: true });
if (!fs.existsSync(groupsDir)) fs.mkdirSync(groupsDir, { recursive: true });

const filesToDownload = [
  { url: 'https://mega.nz/file/S4QXTZqb#Stk3jVvHkqXuaTb9TO-6IxEU3XdN2FgZV2HHvGqg3oM', dest: path.join(teamDir, 'piotr_bartkowski.jpg') },
  { url: 'https://mega.nz/file/uswnkIwA#N9atMzOrFOgwb5BjhOFQWNlZopii4JEOgCddAZ2ELvQ', dest: path.join(teamDir, 'piotr_bartkowski_hover.jpg') },
  { url: 'https://mega.nz/file/a54EyBqS#04X6GmUQ-3rcV6IwvnbrjRJcthvk5EzRec8FGrDhyRQ', dest: path.join(teamDir, 'lukasz_pawliszak.jpg') },
  { url: 'https://mega.nz/file/XsAxjZiL#I4qmGnjEfF_mr7YowfJg7HkKxhc5IRaD1uSlnjqerks', dest: path.join(teamDir, 'lukasz_pawliszak_hover.jpg') },
  { url: 'https://mega.nz/file/yog2WYqT#ixu5b3FE4Yvz78oD5jq6DaIGC6kiNE4BcbW_674lHwk', dest: path.join(teamDir, 'agata_lusawa.jpg') },
  { url: 'https://mega.nz/file/OkAl3KTT#-MHYjFTkTX29gC97Lq-03McrtEcwk3b7goRSTFpAonU', dest: path.join(teamDir, 'agata_lusawa_hover.jpg') },
  { url: 'https://mega.nz/file/nlAGVCgS#cKaUU2u2beMIZ_66P9a4Iiu0ZDyO-mf-5vJK3AyeFSw', dest: path.join(teamDir, 'sabina_sypniewska.jpg') },
  { url: 'https://mega.nz/file/TlZ2jazK#ZimaSXWoEbRsGLysxG5bw_mykeCaTmI3BYlBYIxPQt0', dest: path.join(teamDir, 'sabina_sypniewska_hover.jpg') },
  { url: 'https://mega.nz/file/TwxC2KqL#idHHN7zbe05yJ5I5860NdY5rkStx4zgDizI4Dhb2jPQ', dest: path.join(teamDir, 'zofia_nowicka.jpg') },
  { url: 'https://mega.nz/file/b4BQiRRL#Reprg3wp4ZRaQEznqmTo_sXvsp3aQ3b_7F9Wmvnimm4', dest: path.join(teamDir, 'zofia_nowicka_hover.jpg') },
  { url: 'https://mega.nz/file/Ph4T2BoJ#Nn2gYt6jCu058jYi203Fny0lIquHwQ8g89gcqFgJQvg', dest: path.join(teamDir, 'gozen_ecehan.jpg') },
  { url: 'https://mega.nz/file/mlQ3kQ6A#pXEOdLWB-4TYgjg-innQvz8ptW9RjBQLhnuPk_YaEpw', dest: path.join(teamDir, 'gozen_ecehan_hover.jpg') },
  { url: 'https://mega.nz/file/r5RSlDoD#AwWGX9-2Jczt_D9BOqaaataaLADpAQOpPX_r5I1gKBg', dest: path.join(teamDir, 'maja_banasiak.jpg') },
  { url: 'https://mega.nz/file/S8BxTISC#bvWApCEjUNDxklh6B3FJSiyzzgITw98aqG4AIYlr02U', dest: path.join(teamDir, 'maja_banasiak_hover.jpg') },
  { url: 'https://mega.nz/file/ThInXSRJ#gHLWbYIqgknUIkkgbWkIIta0fjKuDamUidD1I8EOm60', dest: path.join(teamDir, 'malgorzata_pieniazek.jpg') },
  { url: 'https://mega.nz/file/2oxwDZbR#SRv_ByaCsV9mmPNqQziX1Ubg64_zrMIDmfCZrO_A2Vs', dest: path.join(teamDir, 'malgorzata_pieniazek_hover.jpg') },
  { url: 'https://mega.nz/file/ztI0xA4J#jMx1qBWhHysxsTYNLzJ5pbWs8R0WDIQqmlznHMpoUHc', dest: path.join(groupsDir, 'group_2026.jpg') },
  { url: 'https://mega.nz/file/i8AxRRwa#xvKZHwY63qidk5f34kQR9wsvTjcDrr1RI421wgwB7GY', dest: path.join(groupsDir, 'group_2024.jpg') }
];

async function downloadFile(item) {
  if (fs.existsSync(item.dest)) {
    console.log(`Already exists: ${path.basename(item.dest)}`);
    return;
  }
  
  return new Promise((resolve, reject) => {
    try {
      const file = File.fromURL(item.url);
      file.loadAttributes((err) => {
        if (err) return reject(err);
        
        console.log(`Downloading ${path.basename(item.dest)}...`);
        const stream = file.download();
        const writeStream = fs.createWriteStream(item.dest);
        
        stream.pipe(writeStream);
        
        stream.on('end', () => resolve());
        stream.on('error', reject);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function run() {
  console.log("Starting downloads...");
  for (const item of filesToDownload) {
    try {
      await downloadFile(item);
    } catch (e) {
      console.error(`Failed to download ${item.dest}:`, e.message);
    }
  }
  console.log("All done!");
}

run();
