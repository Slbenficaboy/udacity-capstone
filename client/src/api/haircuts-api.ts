import { apiEndpoint } from '../config'
import { Haircut } from '../types/Haircut';
import { CreateHaircutAppointment } from '../types/CreateHaircutAppointment';
import Axios from 'axios'
import { UpdateHaircutAppointment } from '../types/UpdateHaircutAppointment';

export async function getHaircuts(idToken: string): Promise<Haircut[]> {
  console.log('Fetching haircut appointments')

  const response = await Axios.get(`${apiEndpoint}/haircuts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Haircut Appointments:', response.data)
  return response.data.items
}

export async function createHaircut(
  idToken: string,
  newHaircut: CreateHaircutAppointment
): Promise<Haircut> {
  const response = await Axios.post(`${apiEndpoint}/haircuts`,  JSON.stringify(newHaircut), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchHaircut(
  idToken: string,
  haircutId: string,
  updatedHaircut: UpdateHaircutAppointment
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/haircuts/${haircutId}`, JSON.stringify(updatedHaircut), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteHaircut(
  idToken: string,
  haircutId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/haircuts/${haircutId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  haircutId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/haircuts/${haircutId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
