const quotes = [
    {
        quote: "Talk is cheap. Show me the code.",
        author: "Linus Torvalds"
    },
    {
        quote: "First, solve the problem. Then, write the code.",
        author: "John Johnson"
    },
    {
        quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson"
    },
    {
        quote: "The best code is no code at all.",
        author: "Jeff Atwood"
    },
    {
        quote: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House"
    },
    {
        quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler"
    },
    {
        quote: "Simplicity is the soul of efficiency.",
        author: "Austin Freeman"
    },
    {
        quote: "Make it work, make it right, make it fast.",
        author: "Kent Beck"
    },
    {
        quote: "Premature optimization is the root of all evil.",
        author: "Donald Knuth"
    },
    {
        quote: "The most important property of a program is whether it accomplishes the intention of its user.",
        author: "C.A.R. Hoare"
    },
    {
        quote: "Good programmers know what to write. Great ones know what to rewrite.",
        author: "Eric Raymond"
    },
    {
        quote: "Walking on water and developing software from a specification are easy if both are frozen.",
        author: "Edward V. Berard"
    },
    {
        quote: "Programming isn't about what you know; it's about what you can figure out.",
        author: "Chris Pine"
    },
    {
        quote: "The function of good software is to make the complex appear to be simple.",
        author: "Grady Booch"
    },
    {
        quote: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
        author: "Bill Gates"
    },
    {
        quote: "Before software can be reusable it first has to be usable.",
        author: "Ralph Johnson"
    },
    {
        quote: "Fix the cause, not the symptom.",
        author: "Steve Maguire"
    },
    {
        quote: "It's not a bug — it's an undocumented feature.",
        author: "Anonymous"
    },
    {
        quote: "Debugging is twice as hard as writing the code in the first place.",
        author: "Brian Kernighan"
    },
    {
        quote: "Deleted code is debugged code.",
        author: "Jeff Sickel"
    },
    {
        quote: "The best way to learn a new programming language is by writing programs in it.",
        author: "Brian Kernighan"
    },
    {
        quote: "Experience is the name everyone gives to their mistakes.",
        author: "Oscar Wilde"
    },
    {
        quote: "Testing can show the presence of bugs, but not their absence.",
        author: "Edsger W. Dijkstra"
    },
    {
        quote: "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
        author: "Edsger W. Dijkstra"
    },
    {
        quote: "Computer science is no more about computers than astronomy is about telescopes.",
        author: "Edsger W. Dijkstra"
    },
    {
        quote: "The purpose of computing is insight, not numbers.",
        author: "Richard Hamming"
    },
    {
        quote: "Simplicity is prerequisite for reliability.",
        author: "Edsger W. Dijkstra"
    },
    {
        quote: "Controlling complexity is the essence of computer programming.",
        author: "Brian Kernighan"
    },
    {
        quote: "There are only two kinds of languages: the ones people complain about and the ones nobody uses.",
        author: "Bjarne Stroustrup"
    },
    {
        quote: "Programs are meant to be read by humans and only incidentally for computers to execute.",
        author: "Donald Knuth"
    },
    {
        quote: "A language that doesn't affect the way you think about programming is not worth knowing.",
        author: "Alan Perlis"
    },
    {
        quote: "In programming, the hard part isn't solving problems, but deciding which problems to solve.",
        author: "Paul Graham"
    },
    {
        quote: "Great software is built by people who care about the details.",
        author: "Anonymous"
    },
    {
        quote: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
        author: "Patrick McKenzie"
    },
    {
        quote: "Code never lies, comments sometimes do.",
        author: "Ron Jeffries"
    },
    {
        quote: "The sooner you start to code, the longer the program will take.",
        author: "Roy Carlson"
    },
    {
        quote: "You don't write code for the computer. You write code for the next programmer.",
        author: "Anonymous"
    },
    {
        quote: "Good code is its own best documentation.",
        author: "Steve McConnell"
    },
    {
        quote: "A primary cause of complexity is that systems evolve faster than we can understand them.",
        author: "Martin Fowler"
    },
    {
        quote: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke"
    },
    {
        quote: "The computer was born to solve problems that did not exist before.",
        author: "Bill Gates"
    },
    {
        quote: "Software is a great combination between artistry and engineering.",
        author: "Bill Gates"
    },
    {
        quote: "One of my most productive days was throwing away 1,000 lines of code.",
        author: "Ken Thompson"
    },
    {
        quote: "A good programmer is someone who always looks both ways before crossing a one-way street.",
        author: "Doug Linder"
    },
    {
        quote: "Programming is thinking, not typing.",
        author: "Casey Patton"
    },
    {
        quote: "The best performance improvement is the transition from the nonworking state to the working state.",
        author: "John Ousterhout"
    },
    {
        quote: "Simplicity is about subtracting the obvious and adding the meaningful.",
        author: "John Maeda"
    },
    {
        quote: "A program is never less than 90% complete.",
        author: "Anonymous"
    },
    {
        quote: "Every problem in computer science can be solved with another level of indirection.",
        author: "David Wheeler"
    },
    {
        quote: "There is no such thing as a small change.",
        author: "Anonymous"
    },
    {
        quote: "The key to performance is elegance, not battalions of special cases.",
        author: "Jon Bentley"
    },
    {
        quote: "Code quality is not a destination; it is a continuous process.",
        author: "Anonymous"
    },
    {
        quote: "The hardest single part of building a software system is deciding precisely what to build.",
        author: "Fred Brooks"
    },
    {
        quote: "Adding manpower to a late software project makes it later.",
        author: "Fred Brooks"
    },
    {
        quote: "Plan to throw one away; you will, anyhow.",
        author: "Fred Brooks"
    },
    {
        quote: "The cheapest, fastest, and most reliable components of a computer system are those that aren't there.",
        author: "Gordon Bell"
    },
    {
        quote: "Software complexity is an essential property, not an accidental one.",
        author: "Fred Brooks"
    },
    {
        quote: "You can use an eraser on the drafting table or a sledgehammer on the construction site.",
        author: "Frank Lloyd Wright"
    },
    {
        quote: "The only way to go fast is to go well.",
        author: "Robert C. Martin"
    },
    {
        quote: "Clean code always looks like it was written by someone who cares.",
        author: "Robert C. Martin"
    },
    {
        quote: "Truth can only be found in one place: the code.",
        author: "Robert C. Martin"
    },
    {
        quote: "A class should have only one reason to change.",
        author: "Robert C. Martin"
    },
    {
        quote: "The best design is the simplest one that works.",
        author: "Anonymous"
    },
    {
        quote: "Don't comment bad code — rewrite it.",
        author: "Brian Kernighan"
    },
    {
        quote: "Make every line of code count.",
        author: "Anonymous"
    },
    {
        quote: "Technology is best when it brings people together.",
        author: "Matt Mullenweg"
    },
    {
        quote: "The goal of a software engineer is to solve problems, not to write code.",
        author: "Anonymous"
    },
    {
        quote: "Learning to code is learning to think.",
        author: "Steve Jobs"
    },
    {
        quote: "The most damaging phrase in the language is: We've always done it this way.",
        author: "Grace Hopper"
    },
    {
        quote: "A ship in harbor is safe, but that is not what ships are built for.",
        author: "John A. Shedd"
    },
    {
        quote: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        quote: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },
    {
        quote: "The only way to learn programming is to program.",
        author: "Anonymous"
    },
    {
        quote: "Don't fear failure. Fear being in exactly the same place next year as you are today.",
        author: "Michael Hyatt"
    },
    {
        quote: "Code is poetry.",
        author: "WordPress"
    },
    {
        quote: "Programs must be written for people first, computers second.",
        author: "Harold Abelson"
    },
    {
        quote: "The art of programming is the art of organizing complexity.",
        author: "Edsger W. Dijkstra"
    },
    {
        quote: "Simple things should be simple, complex things should be possible.",
        author: "Alan Kay"
    },
    {
        quote: "Good software, like wine, takes time.",
        author: "Joel Spolsky"
    }
];

export default quotes;