# Assignment 2 12316 Web Documents (WebDoc) | WS 2020/21

## Business description

### WHO WE ARE
We are pro-students, a group of 4 Students from BTU. We share the same passion for informatics and computers and thanks to our different and complementary backgrounds, we decided to join our forces in order to found a small consulting company.
- Anna, a Business Law for technology companies student. 
- Albert an Informatics student. 
- Mattia, an eBusiness student.
- Alice, a Cyber Security student.

### WHERE WE ARE BASED
We are physically located in Cottbus. We are fully equipped for online training or consulting sessions and potentially able to reach our customers all over the world, according to university and working schedules and of course any restrictions caused by COVID-19. 
### MISSION
Our mission is to help small/medium business and private citizens understanding and developing digital solutions, offering competitive prices and an effective service.
### VISION
Our vision is a world without any digital divide. 
### SERVICES
Our services can be divided in two main categories: 
- Consulting/Coaching/Tutoring
- Computer hardware and software 
<br>For the first category we are expert in following topics: 
- Software management.
- Software development. 
- IT resources and infrastructure.
- Business and media law.
- Database and data analysis.
- Any topic related to our studies.
<br>For the second category we offer the following services:
- Hardware and software repairing and consultancy
- IT support and maintenance.
### BUYER PERSONA
We identified 4 different Buyer Persona:
- Tom, 24 years old, a master student of BWL in Münster, who doesn’t fully understand how to program in python. Needs an online tutoring.
- Olga, 70 years old, senior citizen in Berlin, is having problems using digital devices to stay connected to her family. Needs a 1 to 1 course.
- Michael, 45 years old, lives in Cottbus, broke his computer but he hasn’t got much money. Needs his computer to be repaired.
- Pizza Berlin GmbH, a small restaurant who needs help in order to maximize its presence on the web and needs to choose the right software for managing orders and taxes.
### WHAT DO WE NEED
We need to establish our online presence with a website. This should be one point of contact with all our different clients. We must have a clear description of our services. 


## WEBSITE REQUIREMENTS

### TECH STACK AND GENERAL REMARKS
The content of website will be static therefore no database is needed and we don't need any login functionalit. The allowed tech stack for this project must contain only the following technlogies: 
- HTML5
- CSS3 
- Plain Javascript
<br>The website must pass the W3C Markup Validation Service and follow all the general rules and aspects of modern web design. Our pages should render legibly and quickly at any screen resolution even on older devices.
 
 
### CONTENT
The main content languages for the first version will be German and English. Afterwards according to business requirements it can be expanded to more languages. Content for each section will be provided by pro-student.de. 
Images should be provided in SVG format where possible. We will also need to integrate video content in our computer repairing section.  
### STRUCTURE
Layout should be structured in this way:
- navbar with brand information and menu items . Should show all items on big screens and collapse to a hamburger menu style for small displays.
- Breadcrumb navigation path.
- One main section above the fold containing a picture, a title, a subtitle and up to two different calls to actions. 
- Introductory section with some icons and short text.
- Main section/s with a full service description and media content.
- FAQ related to the page.
- Contact forms and details.
- Footer contains links to standard pages, mission/vision, logo and name and copyright notice.
### UI & UX
More css style files should be implemented in order to provide a good experience even to people with visual impairments.
Animation can be included if they improve the usability of the website guiding the user to the desidered section.
We need a font which is easy to understand among all the target groups. 
The colors provided are 4:
Dark text and elements: 231F20
Light text and elements: F9F9FF
Sections with darker background:  7EBDC2
Main call to actions: BB4430
### XML Service page
We need an XMl page whit a list of all our courses that we provide, the list of courses will be provided from us such as the element name such as: title, tutor, area, description.



# Developer Documentation

## Developers

* Julius Kiekbusch
* Fabian Mildner

## Division of Work

The following division of work should not be understood as a sign that one person worked entirely on a given task. Much rather, it should be interpreted as the person being the *main person in charge* for fulfilling the given tasks. Many tasks were subject to mutual corrections, adjustments and agreements that were performed by both developers. 

### Julius Kiekbusch

* General Website Design / Common Design for Webpages (MockUp, see the [design on Figma](https://www.figma.com/file/RHo9pFGFubbjlLqGLTjeOa/pro-students.de))
* Individual Webpage design (MockUp, see the [design on Figma](https://www.figma.com/file/RHo9pFGFubbjlLqGLTjeOa/pro-students.de))
* Mobile Adaptability of common page elements and the course lists, including navbar burger menu for mobile / tablet
* HTML generation script and structures based on XML for the course lists
* Pro Students Logo Design
* HTML/CSS Implementation of the About Us page
* Design and HTML/CSS Implementation of the PC Problems page
* Design and HTML/CSS Implementation of a custom 404 page

### Fabian Mildner

* HTML/CSS Implementation of the general website design and the course lists
* HTML/CSS Implementation of the Footer (Adaptable for Mobile, Tablet and Desktop)
* HTML/CSS Implementation of the service lists (For Private, For Companies)
* HTML/CSS Implementation of the legal pages
* Breadcrumb adaptation for mobile (display with ...)
* Implementation of the course lists based on the HTML generation script and structures and provision of suitable illustrations
* Pro Students Logo Creation as SVG
* HTML/CSS Implementation of the consulting page
* HTML/CSS Implementation of the homepage

### Both Equally

* Creation of a suitable build script for generation of the web pages based on partial data
* Design of the Homepage


### --\# TODO \#--

* Tablet Design refinement
* Implementation of Consulting and PC Problems pages
* Clean up CSS and HTML
    * Minimize / optimize class usage
    * Check HTML tag semantics
* Re-check image sources and necessary credits (Undraw, Unsplash)
* Optimize SVGs


## Developing and Building the Website

* Images and XML files as well as JavaScripts and Cascading Style Sheets can be saved directly in the docs folder and corresponding subfolders
* Final HTML files contain elements that repeat across several webpages. As such, those repeating partials have been taken out of the development (source) HTML files and are only inserted through a build step
* Development HTML files and insertible partials should be saved in the src folder (and corresponding sub-folder)

* To build the website, you need to install NodeJS and the Node Package Manager (npm).
* To install necessary packages for the build and watch steps, run `npm install` once from within the root of this repository
* Afterwards, you can build webpages (i.e. assemble development html files with their partials) using `npm run build`
* In addition, you can start browsersync for easier development and testing using `npm run watch`
