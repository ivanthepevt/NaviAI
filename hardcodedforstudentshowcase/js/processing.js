function csvToArray(csvString) {
  const rows = csvString.trim().split(/\r?\n/);
  const result = rows.map(row => {
    const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return columns.map(column => column.replace(/^"|"$/g, ''));
  });
  return result;
}


function similarity(strA, strB) {
  // Remove punctuation and convert to lowercase
  strA = strA.replace(/[^\w\s]/gi, '').toLowerCase();
  strB = strB.replace(/[^\w\s]/gi, '').toLowerCase();

  // Calculate the Levenshtein distance between the two strings
  const matrix = [];
  let i;
  for (i = 0; i <= strB.length; i++) {
    matrix[i] = [i];
  }

  let j;
  for (j = 0; j <= strA.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= strB.length; i++) {
    for (j = 1; j <= strA.length; j++) {
      if (strB.charAt(i - 1) === strA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1));
      }
    }
  }

  const distance = matrix[strB.length][strA.length];

  // Calculate the similarity percentage
  const maxLength = Math.max(strA.length, strB.length);
  const similarityLikelihood = ((maxLength - distance) / maxLength);

  return similarityLikelihood;
}

function substringLikelihood(A, B) {
  const a = A.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '');
  const b = B.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '');
  const lenA = a.length;
  let count = 0;
  for (let i = 0; i < lenA; i++) {
    if (b.includes(a.substring(0, i + 1))) {
      count++;
    }
  }
  return count / lenA;
}
