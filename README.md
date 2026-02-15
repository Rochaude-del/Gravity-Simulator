# Gravity-Simulator
N-Body gravity simulator using the Barnes Hut algorithm written in Javascript.  

![GravitySim](https://github.com/user-attachments/assets/899c3493-6562-4926-ae67-813e65938dac)  

[View Here](https://rochaude-del.github.io/Gravity-Simulator/)

## Theory and Implementation
[The Barnes Hut algorithm](https://en.wikipedia.org/wiki/Barnes-Hut_simulation) is a method for calculating the acceleration a particle experiences from other particles where if sufficiently far from groups of these particles the acceleration is approximated by using the center of mass of the particles rather than calculating the force for each particle, growing in computational time on the order of $O(n\log(n))$ compared to the naive implentation's $O(n^2)$.

The same quadtree data structure used in the calculation of forces is also employed in collision detection.

Each timestep the particles' postitions are updated using [leapfrog intergration](https://en.wikipedia.org/wiki/Leapfrog_integration).

## Controls
You can create new objects from inputing desired paramaters, e.g. position, velocity and mass, by clicking _create planet/disk_ or by constructing them using your mouse on the simulation by clicking the _create viusally_ button.
The checkboxes next to the parameter inputs allow you to use those values instead when creating visually.
When creating visually you can reset what you've created so far by right clicking or leave visual creation by pressing esacape.

By double clicking an object, as long as it has a non zero mass, you can lock the camera onto it which then changes the coordinates of the input values to be centered on that object. When locked on you may also click _create in orbit_ to create a planet or disk orbiting around the locked-on planet. Change orbital direction of a planet by alt clicking. To stop locking on to an object double click empty space.

Delete an object by shift clicking it.

## Performance
Zero mass objects are optimised for usage in large numbers and toggling collisions off increases performance.

