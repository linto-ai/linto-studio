const { stringify } = require('subtitle')
const { Readable } = require('stream')

const maxCharsPerSegment = 80;
const subtitleMapping = {
    srt: {format: 'SRT', type: 'text/plain'},
    vtt: {format: 'WebVTT', type: 'text/vtt'},
}

function splitSubtitles(subtitle) {
    const segments = [];
    let segment = "";
    const punctuationMarks = [",", ".", "!", "?"];

    for (let i = 0; i < subtitle.text.length; i++) {
        const char = subtitle.text[i];
        segment += char;
        // on a space or punctuation mark, split the segment if it's too long
        if (char === " " || punctuationMarks.includes(char)) {
            let lastwords = [];
            if (segment.length >= maxCharsPerSegment) {
                const words = segment.split(" ");
                while (segment.length >= maxCharsPerSegment) {
                    lastwords.push(words.pop()); //array of cut words
                    segment = words.join(" ").trim(); //trim the segment
                }
                segments.push(words.join(" ").trim());
                segment = lastwords.reverse().join(" ");
            // force cut on punctuation mark if segment reaches maxCharsPerSegment / 2
            }
            if (segment.length >= maxCharsPerSegment / 2 && punctuationMarks.includes(char)) {
                segments.push(segment.trim());
                segment = " ";
            }
        }
    }
    if (segment.trim().length > 0) {
        segments.push(segment.trim())
    }

    const totalDuration = Math.round(subtitle['end']*1000 - subtitle['start']*1000)
    const segmentDuration = totalDuration / segments.length

    var result = []
    var lastSegmentEnd = Math.round(subtitle['start']*1000)
    for (segment of segments) {
        start = lastSegmentEnd
        end = start + segmentDuration
        lastSegmentEnd = end
        result.push({'start': start, 'end': end, 'text': segment})
    }

    return result;
}


const subtitleGenerator = (type, session, channel) => {
    return new Promise((resolve, reject) => {
        let buffer = ''
        const sourceStream = new Readable({ objectMode: true })

        sourceStream.push({
            type: 'header',
            data: `${session.name} - ${channel.name} (${channel.languages.join('_')})`
        })

        channel.closed_captions.map(caption => {
            splitSubtitles(caption).map(subtitle => {
                sourceStream.push({
                    type: 'cue',
                    data: {
                        start: subtitle.start,
                        end: subtitle.end,
                        text: subtitle.text
                    }
                })
            })
        })
        sourceStream.push(null)

        sourceStream
            .pipe(stringify({ format: subtitleMapping[type].format }))
            .on('data', chunk => {
                buffer += chunk
            })
            .on('finish', () => {
                resolve(new Blob([buffer], { type: subtitleMapping[type].type }))
            })
    })
}

const srtGenerator = (session, channel, _) => {
    return subtitleGenerator('srt', session, channel)
}

const vttGenerator = (session, channel, _) => {
    return subtitleGenerator('vtt', session, channel)
}


module.exports = {
    srtGenerator,
    vttGenerator
}
