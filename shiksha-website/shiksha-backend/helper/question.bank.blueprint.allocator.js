function largestRemainder(items, total, getWeight) {
  const weightTotal = items.reduce((sum, item) => sum + Number(getWeight(item)), 0);
  const quotas = items.map((item, index) => {
    const exact = (Number(getWeight(item)) / weightTotal) * total;
    return { index, count: Math.floor(exact), remainder: exact % 1 };
  });

  let remaining = total - quotas.reduce((sum, item) => sum + item.count, 0);
  quotas
    .slice()
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
    .forEach(item => {
      if (remaining > 0) {
        quotas[item.index].count += 1;
        remaining -= 1;
      }
    });

  return quotas.map(item => item.count);
}

function interleave(values) {
  const counts = new Map();
  values.forEach((value, index) => {
    const current = counts.get(value);
    counts.set(value, { index: current?.index ?? index, count: (current?.count ?? 0) + 1 });
  });

  const result = [];
  let previous;
  while (result.length < values.length) {
    const [value, entry] = Array.from(counts.entries())
      .filter(([, item]) => item.count > 0)
      .sort((a, b) => {
        const countDiff = b[1].count - a[1].count;
        if (countDiff) return countDiff;
        const repeatDiff = Number(a[0] === previous) - Number(b[0] === previous);
        return repeatDiff || a[1].index - b[1].index;
      })[0];

    result.push(value);
    entry.count -= 1;
    previous = value;
  }

  return result;
}

function expandByCounts(items, counts, getValue) {
  return items.flatMap((item, index) => Array(counts[index]).fill(getValue(item)));
}

function allocateQuestionBankBlueprint(templates, context) {
  return templates.map(template => {
    const marksPerQuestion = Number(template.marksPerQuestion);
    if (!marksPerQuestion) throw new Error(`Question type "${template.type}" is missing marksPerQuestion`);
    if (!context.marksDistribution.length) throw new Error("marksDistribution is required for question allocation");
    if (!context.objectiveDistribution.length) throw new Error("objectiveDistribution is required for question allocation");

    const numberOfQuestions = template.numberOfQuestions || Math.ceil(Number(context.totalMarks) / marksPerQuestion);
    if (template.questionDistribution?.length === numberOfQuestions) return { ...template, numberOfQuestions };

    const unitCounts = largestRemainder(context.marksDistribution, numberOfQuestions, item => item.marks);
    const objectiveCounts = largestRemainder(context.objectiveDistribution, numberOfQuestions, item => item.percentageDistribution);

    const units = interleave(expandByCounts(context.marksDistribution, unitCounts, item => item.unitName));
    const objectives = interleave(expandByCounts(context.objectiveDistribution, objectiveCounts, item => item.objective));

    return {
      ...template,
      numberOfQuestions,
      questionDistribution: units.map((unitName, index) => ({
        unitName,
        objective: objectives[index],
      })),
    };
  });
}

module.exports = { allocateQuestionBankBlueprint };
