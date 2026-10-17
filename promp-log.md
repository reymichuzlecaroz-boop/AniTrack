# AniTrack: Prompt Engineering Log

**Task 1: Sector Selection**

Sector: Agriculture & Food Innovation

**Project Title:** AniTrack – A Web-Based Crop and Harvest Monitoring System

**Target Users:** Local farmers and small-scale vegetable growers.

**Challenge:** Farmers may have difficulty tracking crop records, planting schedules, and expected harvest dates.

**Proposed Features:**
1. Crop Record Management
2. Planting and Harvest Schedule
3. Crop Status Dashboard

## Task 2: Zero-Shot Prompt

Technique: Zero-Shot Prompting

**Prompt Used:**
"Create a simple and interactive crop monitoring website called AniTrack using HTML, CSS, and JavaScript. Include crop records, planting schedules, and harvest status. Use sample data only."

 **AI Output:** Copilot generated a basic crop monitoring website called AniTrack using HTML, CSS, and JavaScript. It included crop records, planting schedules, and harvest status using sample data.

**Observation:** The generated website provided a good starting point for the project. However, some features and the design may need improvement to make the website more user-friendly and easier for farmers to use.

## Task 3: Structured Prompt

**Technique:** Role, Task, Context, Constraints, Expected Output, and Acceptance Criteria

**Prompt Used:**  Act as a frontend web developer. Create a responsive, single-page crop and harvest monitoring website called AniTrack. The website is designed for local farmers in the Philippines who need an easier way to record crops, monitor planting schedules, and track expected harvest dates. Use HTML, CSS, and vanilla JavaScript only. Do not use external frameworks, backend services, databases, or external APIs. Use sample crop data only.Provide the required frontend files, including HTML, CSS, and JavaScript. Include a crop record section, planting and harvest schedules, and a dashboard showing crop statuses such as Planted, Growing, and Ready for Harvest.The website must have a clean, responsive design that works on mobile screens. Users must be able to view sample crop records, understand planting and harvest schedules, and identify the status of each crop easily.

**AI Output:**
Copilot generated a more detailed AniTrack website with crop records, planting and harvest schedules, and a crop status dashboard. It followed the specified technologies and included a responsive layout.

**Observation**
The structured prompt produced a more organized and relevant website than the zero-shot prompt. It provided clearer instructions about the target users, required features, and design. However, I still need to test the website's interactive features and mobile responsiveness.


**Two Differences Compared with the Zero-Shot Result**
1. More specific features: The improved prompt clearly described the crop record section, planting and harvest schedules, and crop status dashboard.
2. Clearer requirements: The improved prompt included the target users, technology limitations, and mobile responsiveness requirements, helping guide Copilot toward a more relevant result.

## Task 4A: Few-Shot Prompting

**Technique:** Few-Shot Prompting

**Prompt Used:** Create crop record items using this format:

Example 1:
Crop Name: Tomato
Category: Vegetable
Planting Date: October 1, 2026
Status: Growing

Example 2:
Crop Name: Eggplant
Category: Vegetable
Planting Date: October 5, 2026
Status: Planted

Generate four additional crop records using the same format and display them on the AniTrack website.

**AI Output:** Copilot generated additional crop records following the provided format, including crop names, categories, planting dates, and crop statuses.

**Observation:** The few-shot prompt helped Copilot follow a consistent format for the crop records. The examples made the expected structure clearer and helped organize the crop information on the website.

**Next Action:** Try assigning the AI a specific role.


## Task 4B: Role Assignment

**Technique:** Role-Based Prompting

**Prompt Used:** Act as a frontend usability reviewer. Examine the generated AniTrack crop monitoring website. Identify problems involving navigation, crop record readability, mobile responsiveness, and the clarity of planting schedules and crop statuses. Recommend specific improvements without changing the project's scope or technologies.

**AI Output:** The copilot says "

## AniTrack usability review

The current interface provides the requested crop records and status labels, but a few usability issues could make it harder for farmers to scan and navigate—especially on phones.

### Navigation
- **Labels disappear at tablet and mobile widths.** At widths up to 850px, navigation becomes icon-only; on phones, it moves to the bottom of the screen and remains icon-only. The buttons have accessible labels, but people may not know what an unfamiliar icon means. Consider adding short visible labels, or tooltips and a first-use hint.
- **The crop-count badge is ambiguous.** It appears beside Crop records on larger screens, but becomes a small colored dot on phones. Hide the count on mobile or show it in a way that doesn’t look like a notification.

### Crop record readability
- **The full records table needs horizontal scrolling on phones.** It has eight columns and a minimum width of 820px. This preserves the columns, but makes details such as category and planting date easy to miss. Consider showing each crop as a compact card on narrow screens, or clearly indicating that the table can be scrolled.
- **The dashboard crop table is dense, too.** It shows five columns and all six records in a compact area. Consider limiting the overview to a few rows with a visible “View all” link, leaving the full list to the records page.
- **The “Active fields” metric displays hectares.** That label implies a field count, while the value represents crop area. Rename it to “Planted area,” or show an actual field count as the main value.

### Mobile responsiveness
- **The page fits the viewport, but fitting doesn’t guarantee easy reading.** Crop tables rely on sideways scrolling, and nav controls rely on icons alone. Check those interactions at narrow widths with actual users and ensure the scrollable table has a clear cue.
- **Schedule and harvest summaries are compact on small screens.** Their small labels and multi-column card layouts may be difficult to scan. Consider stacking the cards or increasing text size and spacing on narrow displays.

### Planting schedules and crop statuses
- **The schedule mixes planting, field-care, and harvest events.** The “Planting schedule” title may lead users to expect planting dates only. Consider renaming it “Farm schedule,” or separating event types with filters or clearer grouping.

- **The schedule doesn’t include planting events for the listed crops.** It shows general field activities and expected harvests, while planting dates appear only in the crop records. Adding each crop’s planting event to the timeline would connect the records to the schedule.

- **The status and progress can tell different stories over time.** Sample statuses are set directly in the crop records, while progress and upcoming-harvest counts use dates. As time passes, a crop may approach or pass its harvest date without its recorded status changing. Consider deriving status consistently from dates, or explaining how farmers should update it.

- **Add a short status guide.** The badges include text as well as color, which helps, but farmers may still benefit from a one-line explanation of when to use **Planted**, **Growing**, and **Ready for Harvest**.

**Observation:** The role-assignment prompt encouraged Copilot to examine AniTrack from a usability perspective. It provided targeted suggestions for improving the website's layout and readability while keeping the original project features.

**Next Action:** Review the actual code for problems.



## Task 5: Structured Analysis and Refinement

**Technique:** Code Review and Refinement

**Prompt Used:** Review my AniTrack crop monitoring website. Check whether the crop records are displayed correctly, whether the planting and harvest schedules are clear, and whether the interface is usable on mobile screens. Identify the two most important implementation issues based on my actual code. Recommend the smallest appropriate corrections and explain how I can test them.

**Issues Identified:** Copilot identified two main issues in AniTrack. First, the schedule shows all harvest events as "Upcoming," even when their dates have already passed. Second, the mobile navigation hides its text labels, and the crop-record table is difficult to view on smaller screens because it requires horizontal scrolling. Copilot recommended filtering past harvest dates and improving the mobile layout.

**Correction Applied:** I will prioritize correcting the schedule so that past harvest dates no longer appear in the "Upcoming" list.

**Verification:** I will test the schedule using sample crop records with past and future harvest dates. I will also check the website at 390px and 320px screen widths to evaluate the mobile navigation and crop-record table.

## Task 6: Comparison and Final Reflection

**Comparison:**

Zero-shot prompting generated a basic AniTrack website using simple instructions. Structured prompting provided clearer requirements and more specific features. Few-shot prompting helped maintain a consistent format for crop records, while role-based prompting provided suggestions for improving the website's usability.

**Most Effective Technique:**

Structured prompting was the most effective technique for my project because it provided clear instructions, defined the target users, and specified the required features and design. It helped guide the AI toward the goals of AniTrack.

**Final Reflection:**

I learned that writing clear and detailed prompts can help improve AI-generated code. Reviewing the code also helped me identify problems with the crop schedule and mobile layout. I realized that AI-generated code should be tested to ensure that the website works correctly and meets the project requirements.
