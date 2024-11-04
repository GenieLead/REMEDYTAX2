document.getElementById('taxForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Gather inputs from the form
    const name = document.getElementById('name').value || 'there';
    const taxDebt = parseFloat(document.getElementById('taxDebt').value);
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value);
    const employmentStatus = document.getElementById('employmentStatus').value;
    const financialWorsened = document.getElementById('financialWorsened').value;
    const unpaidYears = document.getElementById('unpaidYears').value;

    // Prepare the data for OpenAI API request
    const userData = {
        name: name,
        taxDebt: taxDebt,
        monthlyIncome: monthlyIncome,
        monthlyExpenses: monthlyExpenses,
        employmentStatus: employmentStatus,
        financialWorsened: financialWorsened,
        unpaidYears: unpaidYears
    };

    const openAIRequest = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: `
You are a tax relief consultant generating a structured assessment letter. Structure the response using the following example format to ensure readability:

---
**Tax Relief Assessment for [User’s Name]**

Hello [User’s Name],

Based on the details you provided, here’s a personalized assessment of your tax relief options, along with actionable steps to resolve your tax debt.

---

### Summary of Your Tax Situation
Given your current tax debt of $[amount], monthly income of $[income], and recent financial hardship, there are several potential relief options available to you. Here’s a tailored plan to help you take the right steps toward resolving your tax debt.

---

### Recommended Tax Relief Options

- **Offer in Compromise (OIC)**  
   - Gather Financial Documentation: Collect evidence of your income, expenses, assets, and liabilities to support your claim.
   - Submit Form 656: Complete and submit Form 656, Offer in Compromise.
   - Monitor Your Case: The IRS may take several months to respond, so continue monitoring your case for any updates.

- **Installment Agreement**  
   - Calculate a Manageable Payment: Determine an affordable monthly payment based on your disposable income.
   - Submit Form 9465: Use Form 9465 to formally request a payment plan.
   - Begin Payments Immediately: Making timely payments will prevent further IRS actions, such as liens or levies.

- **Currently Not Collectible (CNC) Status**  
   - Show Proof of Financial Hardship: Submit financial statements or a statement of hardship to support your request.
   - Contact the IRS: Reach out to confirm your eligibility for CNC status, and discuss any additional documentation they may require.

---

### Step-by-Step Action Plan

- **Gather Financial Documentation**  
   - List necessary documents (e.g., income statements, expense reports).

- **Assess Eligibility**  
   - Provide guidance on evaluating qualification for each relief option.

- **Submit Applications**  
   - Detail forms required for each option.
   - Offer tips for accurate completion.

- **Follow Up**  
   - Advise on maintaining communication with the IRS.
   - Suggest monitoring application status.

---

### Risks of Not Addressing Tax Debt Promptly

Failure to handle your tax debt in a timely manner can result in significant consequences, including:

- **Accrued Interest and Penalties**: Unpaid taxes accumulate interest and penalties, increasing your debt burden over time.
- **IRS Collection Actions**: The IRS may take collection actions, such as wage garnishment, tax liens, or bank levies, to recover unpaid taxes.
- **Credit Impact**: A tax lien can negatively affect your credit score, impacting your financial stability.
- **Increased Stress**: Lingering tax debt can create ongoing financial stress and disrupt your peace of mind.

---

### Additional Insights and Best Practices

- **Keep Organized Records**: Maintain detailed records of all communication with the IRS and your financial documentation.
- **Work with a Tax Professional**: Given the complexity of IRS processes, a tax professional can help streamline your application for relief and negotiate on your behalf.
- **Follow Up Regularly**: Stay proactive in checking the status of your applications to avoid any missed deadlines or actions from the IRS.

---

By following these steps, you can reduce the stress associated with tax debt and move toward a more stable financial future. Please feel free to reach out if you need further guidance.

---` },
            { role: "user", content: `Here is the user's data: ${JSON.stringify(userData)}. Please provide the structured assessment letter in the format specified above, including the Step-by-Step Action Plan and Risks of Not Addressing Tax Debt Promptly sections.` }
        ],
        max_tokens: 1000,
        temperature: 0.7,
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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`
            },
            body: JSON.stringify(openAIRequest),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed with status ${response.status}: ${response.statusText}`);
            console.error("Response Error Details:", errorText);
            alert("There was an issue generating the analysis. Please try again later.");
            return;
        }

        const responseData = await response.json();
        const aiAnalysis = responseData.choices[0].message.content;

        // Display AI-generated assessment letter with HTML formatting
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = formatAssessmentLetter(aiAnalysis, name);
        resultDiv.style.display = 'block';

    } catch (error) {
        console.error("Error with OpenAI API request:", error);
        alert("There was an issue generating the analysis. Please try again later.");
    }
});

// Function to format the AI-generated response into HTML structure
function formatAssessmentLetter(text, userName) {
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Tax Relief Assessment for ${userName}</h2>
                <p>Hello ${userName},</p>
                <p>Based on the details you provided, here’s a personalized assessment of your tax relief options, along with actionable steps to resolve your tax debt.</p>
                ${text.replace(/\n/g, "<br>")}
                <p>By following these steps, you can reduce the stress associated with tax debt and move toward a more stable financial future. Please feel free to reach out if you need further guidance.</p>
            </div>`;
}
