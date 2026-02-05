module.exports = async ({ github, context }) => {
  const fs = require('fs');

  // Check if coverage report exists
  if (!fs.existsSync('shiksha_coverage_report.md')) {
    console.log('Coverage report not found, skipping PR comment');
    return;
  }

  const coverageReport = fs.readFileSync('shiksha_coverage_report.md', 'utf8');

  // Find existing coverage comment
  const comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  const botComment = comments.data.find(comment =>
    comment.user.login === 'github-actions[bot]' &&
    comment.body.includes('📊 Shiksha Services - Test Coverage Report')
  );

  const commentBody = `${coverageReport}\n\n---\n*Updated: ${new Date().toUTCString()}*`;

  if (botComment) {
    // Update existing comment
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: botComment.id,
      body: commentBody
    });
    console.log('✅ Updated existing coverage comment');
  } else {
    // Create new comment
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: commentBody
    });
    console.log('✅ Created new coverage comment');
  }
};
