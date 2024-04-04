const { Chord, Note } = require('tonal');
const readline = require('readline');

function transpile(code) {
  const mainRegex = /^(\w+)\s*=\s*(.*)$/;
  const itemRegex = /([A-Ga-g](?:#|b)?(?:m|Maj|min|sus|dim|aug)?\d?(?!\w))|(I|II|III|IV|V|VI|VII)|(?:\b)(\d\d?)(?:\b)/g;

  const mainMatch = code.match(mainRegex);
  if (!mainMatch) return null;

  const variableName = mainMatch[1];
  const itemsString = mainMatch[2];

  let itemMatch;
  const items = [];

  while ((itemMatch = itemRegex.exec(itemsString)) !== null) {
    if (itemMatch[1]) { // Chord names
      items.push(`"${itemMatch[1]}"`);
    } else if (itemMatch[2]) { // Roman numerals
      items.push(`"${itemMatch[2]}"`);
    } else if (itemMatch[3]) { // MIDI note numbers
      items.push(parseInt(itemMatch[3]));
    }
  }

  if (items.length > 0) {
    return `const ${variableName} = p([${items.join(', ')}]);`;
  }

  return null;
}

function eval(input) {
  const regex = /([A-Ga-g](?:#|b)?(?:m|Maj|min|sus|dim|aug)?\d?(?!\w))|(I|II|III|IV|V|VI|VII)|(?:\b)(\d\d?)(?:\b)/g;
  const items = [];
  while ((match = regex.exec(input)) !== null) {
    if (match[1]) { // Chord names
      const chord = Chord.get(match[1]);
      // console.log(chord);
      const notes = chord.notes.map(n => Note.midi(`${n}3`));
      console.log(notes);
      items.push(chord.name);
    } else if (match[2]) { // Roman numerals
      items.push(`${match[2]}`);
    } else if (match[3]) { // MIDI note numbers
      items.push(parseInt(match[3]));
    }
  }
  console.log(items);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  try {
    const result = eval(line);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});

const code = "pattern = Am G D 60 VII > retrograde > rotate 2";
console.log(transpile(code));
