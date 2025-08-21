import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project-${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    socket.on('cell-update', (data) => {
      socket.to(`project-${data.projectId}`).emit('cell-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
