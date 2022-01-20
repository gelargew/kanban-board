# Kanband Board

a Task management prototype App.

check it live @ [kanban-board-gelar.vercel.app](https://kanban-board-gelar.vercel.app/)

## :zap: How to Run 

get the latest version by cloning `git clone https://github.com/gelargew/kanban-board.git` or download the zip 
[here](https://github.com/gelargew/kanban-board/archive/refs/heads/main.zip). \
make sure you're in the project root directory and then:

yarn: 

```
yarn install
yarn dev
```

npm:

```
npm install
npm run dev
```

# Tech stuff...



## Steps

1. how am i going to do this ? what tools should i use ?
-   why vite ? in my opinion its the fastest framework to create a small prototype app, easily convert to other framework.
-   animation & styling ? i mostly use plain css so im going to do it again. for animation.
-   to be able to create an animated layout/dragable cards while updating the data, the most important thing is a state management. there are several that i have think to use for this prototype: React.usecontext, zustand & jotai. First i decided to use zustand because of its good reputation and simple APIs.

2. coding state management \
first few hours was quite unproductive, switching between useContext and zustand until found out that the current version of zustand have some typescript bug. so im trying jotai for the first time, its my first time using atom based state management so i speend more extra hours to learn from the documentation. my code was definitely unoptimal and messy, but my state/storage ended up performs pretty well (jotai is good :)).

3. coding bussiness logic / data interaction  \
assigning a dragEvent into eash task, keeping track of mouse position while dragging, deciding where the task should go when it snap. \
things i learn:
-   RectDOM & RectDOMReadOnly doesnt give the same values while having the same description on MDN.
-   Event.currentTarget is almost always better than Event.target because of event bubbling.
-   PointerEvent doesnt trigger while draggin other element.

4. styling, animating & refactoring.








#### notes: 
- untested on safari Mac
