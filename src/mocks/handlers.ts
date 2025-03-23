import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock para obtener el perfil de usuario por UUID
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    
    // Simulamos un usuario con rol PATIENT
    return HttpResponse.json({
      success: true,
      message: "Operación realizada con éxito",
      data: {
        id: id,
        authUserId: id,
        firstName: "Elena",
        lastName: "López",
        fullName: "Elena López",
        role: "PATIENT"
      },
      timestamp: new Date().toISOString()
    });
  }),
]; 