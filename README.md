# Dollar Game Online

Dollar Game Online is a game based on a video by Numberphile, and is implemented with p5JS, a JavaScript library that starts with the original goal of Processing, to make coding accessible for artists, designers, educators, and beginners, and reinterprets this for today's web. No other libraries are used, no dependencies are present apart from the two main p5 libraries: p5.js and p5.dom.js.

You can check out p5JS here: https://www.p5js.org

Processing is a flexible software sketchbook and a language for learning how to code within the context of the visual arts. Since 2001, Processing has promoted software literacy within the visual arts and visual literacy within technology. There are tens of thousands of students, artists, designers, researchers, and hobbyists who use Processing for learning and prototyping.

You can check out processing here: https://www.processing.org/

Finally, you can find the video inspired me to do this project here: https://www.youtube.com/watch?v=U33dsEcKgeQ
We love you, Numberphile!

# Background

I have been working on this project in my free time and it has evolved quite a bit (you can see that in the commit history of the repo). The dream is to complete all #TO-DOs of the project and finally release it as v1.0.0.0.0. That will be one project out of my mind, right?

# Goal of the game

In the game, there are a certain number of "Agents" with some money, and they are connected to each other via bonds. Each agent, once clicked, gives all connected Agents $1 (and loses that amount of money in the process!).
The goal of the game is to make it so that all agents have higher than or equal to $0. In other words, no agent must be in debt!

# Winning  the game

Once you make the debt of all agents go away, you win the game! Your total move count is displayed on the screen as reference.
Your move count is also displayed on the lower left side of the screen during the game.

You will always eventually win the game, the goal is to make this in the least amount of moves and in the least amount of time. 

# Save-load function

When the page loads, a long string containing numbers is generated on the bottom of the screen. That dictates the state of the game (the number of agents, the money they possess and how they are connected). You can copy this code and share it with anyone, and once they paste that in the text box of their game, a new game is created which is essentially the same as yours!
Why "essentially" you say? Because in Dollar Game Online, the positions and the colors of agents are irrelevant as long as other parameters are correct. All players will and can finish the game in the same amount of moves.

Also, if you can manage to solve the encoding logic, you can generate your own codes and play that way! Just be careful to not use more than 5 agents, because of the insane logic that is operating behind the scenes. It just exceeds maximum stack size!

One of the main things I have on my agenda is to create a UI that generates this code based on your input, so that you can test it with your friends.

# Why "Online"?
This here is the big thing. 

Do you remember that I told you about the game reduced to a simple string each time you play it?
Well, if I can manage to integrate Google Sheets API or MongoDB API into the project, I will be able to track the lowest amount of moves and the least amount of time needed to solve a particular string, collected from players all around the world (maybe even in thousands!).
Yes, the game will be turned into a MMO with a simple script.
I accept all recommendations to make this happen, this is a huge dream of mine!
