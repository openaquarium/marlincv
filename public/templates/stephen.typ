#import "@preview/basic-resume:0.1.0": *

// Put your personal information here, replacing mine
#let name = "Mohammad Tamimul Ehsan"
#let location = "Dhaka, Bangladesh"
#let email = "**@gmail.com"
#let github = "github.com/tamimehsan"
#let linkedin = "linkedin.com/in/tamimehsan"
#let phone = "+1 (xxx) xxx-xxxx"
#let personal-site = "tamimehsan.github.io"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  linkedin: linkedin,
  phone: phone,
  personal-site: personal-site,
  // Accent color is optional. Feel free to remove the next line if you want your resume to be in black and white
  accent-color: "#26428b",
)

/*
* Lines that start with == are formatted into section headings
* You can use the specific formatting functions if needed
* The following formatting functions are listed below
* #edu(dates: "", degree: "", gpa: "", institution: "", location: "")
* #work(company: "", dates: "", location: "", title: "")
* #project(dates: "", name: "", role: "", url: "")
* #extracurriculars(activity: "", dates: "")
* There are also the following generic functions that don't apply any formatting
* #generic-two-by-two(top-left: "", top-right: "", bottom-left: "", bottom-right: "")
* #generic-one-by-two(left: "", right: "")
*/
== Education
{{education}}

== Work Experience
{{experience}}

== Extracurricular Activities
{{achievement}}
