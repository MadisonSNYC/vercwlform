// components/test-utils/form-validator.ts

interface FormData {
  name: string
  email: string
  message: string
  subscribe: boolean
  gender: string
  country: string
}

export function validateForm(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.name.trim()) {
    errors.name = "Name is required."
  }

  if (!data.email.trim()) {
    errors.email = "Email is required."
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid."
  }

  if (!data.message.trim()) {
    errors.message = "Message is required."
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long."
  }

  if (!data.gender) {
    errors.gender = "Please select a gender."
  }

  if (!data.country) {
    errors.country = "Please select a country."
  }

  return errors
}
