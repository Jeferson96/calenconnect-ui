
// Este archivo actúa como punto de entrada para todos los servicios API
import appointmentsService from './appointments';
import userService from './user';
import availabilityService from './availability';
import professionalsService from './professionals';

// Exportamos todos los servicios para un fácil acceso
export {
  appointmentsService,
  userService,
  availabilityService,
  professionalsService,
};
