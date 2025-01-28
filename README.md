# Budget-Calculator
The Budget Calculator is a dynamic web application designed to help users manage their finances by tracking income and expenses. The application features an interactive interface, allowing users to add income sources and expense categories, as well as visualize their financial data through charts.

![Budget Calculator Screenshot](./gallery/screenshot.png)

Key Features
1. Expense Category Dropdown with Dynamic Options
The dropdown menu allows users to select expense categories such as Rent, Utilities, Groceries, and Entertainment.
Once a category is selected, it is disabled in other dropdowns to avoid duplication. The only exception is the "Other" option, which remains selectable multiple times, allowing users to enter custom categories.
This dynamic feature ensures that the categories in the dropdown are updated in real time as selections are made, offering a seamless experience for users.
2. Real-Time Budget Updates
The budget updates automatically when users enter income and expense values.
The total income, total expenses, and remaining budget are recalculated on the fly, giving users immediate feedback on their financial situation.
The user interface is reactive, thanks to Vue.js, ensuring that all elements of the page reflect the changes as the user interacts with the calculator.
3. Negative Number Prevention
To avoid errors, the application prevents negative values in the income and expense fields. If a user attempts to input a negative number, it is automatically corrected to zero.
This feature ensures that users do not accidentally enter invalid data that would distort their budget calculations.
4. Interactive Visualizations with Charts
The application integrates Chart.js to provide dynamic visualizations of the user's budget.
Pie charts display the proportion of expenses relative to income, while additional pie charts break down individual categories (e.g., Rent, Utilities, Groceries).
These visualizations help users understand their spending patterns in a clear and engaging way.
5. Adding and Removing Income and Expense Items
Users can add multiple income sources and expense categories to the calculator.
The "Remove" button for each expense item only appears after an amount has been entered, ensuring that users can manage their entries without cluttering the interface.
This dynamic functionality ensures that the calculator adapts to the user's financial needs.
Future Additions
The following features are planned for future versions of the Budget Calculator:

Save and Load Budget: Allow users to save their budget to a database and load it again on subsequent visits.
Recurring Expenses: Implement the ability to mark certain expenses as recurring (e.g., rent, subscriptions) and automatically populate them in future months.
Currency Conversion: Integrate a currency conversion API to support users managing budgets in different currencies.
Export to PDF/Excel: Provide the option to export the budget as a PDF or Excel file for offline tracking and sharing.
User Authentication: Add login functionality so users can have their own accounts and save data securely.
Known Bugs
Negative Number Issue:

There is currently an issue where two negative numbers add up to a positive number. This was due to a mistake in handling the mathematical logic. A fix will be implemented soon to ensure that negative numbers are handled correctly. This bug was pointed out after committing the code, and the fix will be prioritized for the next update.
Dropdown Selection Glitch:

Occasionally, the dropdown menu does not immediately update when a new row is added, leaving some categories enabled that should be disabled. This issue can occur when a user quickly adds multiple rows. A fix will be added to better handle the initial row selections.
