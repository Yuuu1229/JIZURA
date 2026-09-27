/* Shared browser / AE (ES3) lyric weighting. Pure analysis: never draws randomness,
   changes text, mutates a style or performs network requests. Only opt-in styles. */
function fsrSemantic(st, text) {
    if (!st.lyricRules) return null;
    // ES3-safe compatibility normalization; retain the original lyric for rendering.
    var s = String(text || '').replace(/[\uFF01-\uFF5E]/g, function(c) { return String.fromCharCode(c.charCodeAt(0) - 65248); }).toLowerCase().replace(/[\s\u3000]+/g, ' ');
    var out = { tags: [], matches: {}, weights: {} }, i, j, g, k;
    for (i = 0; i < st.lyricRules.length; i++) {
        var rule = st.lyricRules[i], hits = [];
        for (j = 0; j < rule.words.length; j++) {
            var word = rule.words[j], found;
            // Latin words/phrases use boundaries: 'run' must not match 'trunk'.
            if (/^[a-z ]+$/.test(word)) found = new RegExp('(^|[^a-z0-9])' + word.replace(/ /g, '\\s+') + '($|[^a-z0-9])', 'i').test(s);
            else found = s.indexOf(word) >= 0;
            if (found) hits.push(word);
        }
        if (!hits.length) continue;
        out.tags.push(rule.tag); out.matches[rule.tag] = hits;
        // Count each tag once; multiple related words cannot swamp the pool.
        for (g in rule.weights) {
            if (!out.weights[g]) out.weights[g] = {};
            for (k in rule.weights[g]) out.weights[g][k] = Math.min(3.2, (out.weights[g][k] || 1) + rule.weights[g][k] - 1);
        }
    }
    return out;
}
function fsrSemanticWeight(semantic, group, key) {
    return semantic && semantic.weights[group] && semantic.weights[group][key] || 1;
}
