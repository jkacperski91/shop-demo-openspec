import { createRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { rootRoute } from './root-route'

/**
 * Second route ("/newsletter-signup"). Exists both to satisfy the
 * frontend-foundation spec's "at least two distinct views" routing
 * requirement, and to host the example form that satisfies the
 * "form handling with validation" requirement.
 */
export const newsletterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/newsletter-signup',
  component: NewsletterSignupPage,
})

interface NewsletterFormValues {
  email: string
}

function NewsletterSignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<NewsletterFormValues>({ mode: 'onSubmit' })

  const onSubmit = (_values: NewsletterFormValues) => {
    // No backend wiring yet - this route exists to prove the form-handling
    // foundation works end to end, not to send real newsletter signups.
  }

  return (
    <section>
      <h1>Newsletter Signup</h1>
      <p>Example form - required-field validation only, no data is sent anywhere yet.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address.',
              },
            })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <button type="submit">Sign up</button>

        {isSubmitSuccessful && !errors.email && (
          <p className="form-success">You're signed up. Thanks!</p>
        )}
      </form>
    </section>
  )
}
