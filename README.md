# Oriane

Aim of this project is to make websites accessible for visually impaired people.
It is a command line tool which helps to test whether a website is web accessibility compliant or not. It crawls a web page for different urls of the same domain and performs web accessibility testing for each consecutive url, according to [WCAG](https://www.w3.org/TR/WCAG21/) standards. When the crawler crawls a webpage it looks for anchor tags. Filtering is done at this stage, only valid urls are checked for accessibility. 

Process followed during Web Accessibility testing: 
- Provide a website URL. 
- Crawl the given URL for all the links present on that page 
- Find links and check if they are valid URLs or not. They should not be email links, ppts, or a different one. For all these, we have checked with the help of regular expressions. 
- After getting the links, we checked for the accessibility violations, if found a list of those will appear with the element in which that error occurred. 
To test for accessibility, Selenium WebDriver is used, which is a browser automation framework that accepts commands and sends them to a browser. It is implemented through a browser-specific driver. It controls the browser by directly communicating with it. 

Flowchart for accessibility testing:

![image](https://user-images.githubusercontent.com/53360510/187070153-aec747a5-2bca-426e-adf3-65a5fa1eb34d.png)


Various commands to perform the testing are:

![image](https://user-images.githubusercontent.com/53360510/187068748-9886e5e1-83e4-44ea-9bfb-09fb12f9f588.png)

![image](https://user-images.githubusercontent.com/53360510/187068755-8f3727c0-688d-4943-a2a6-2cf3256a3b52.png)

![image](https://user-images.githubusercontent.com/53360510/187068997-9aadc745-0b3f-4f31-bfb2-514df5830887.png)

![image](https://user-images.githubusercontent.com/53360510/187069053-c301aa28-d8dc-4681-8ba8-d1b110babde1.png)
