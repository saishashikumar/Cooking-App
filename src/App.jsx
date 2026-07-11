import { useMemo, useState } from 'react';

const dietOptions = ['Veg', 'Non-Veg', 'Vegan'];
const timeOptions = [15, 30, 60];

const initialForm = {
  budget: '1200',
  people: '2',
  diet: 'Veg',
  cookingTime: 30,
  ingredients: '',
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const isBudgetSafe = useMemo(() => {
    if (!result?.estimatedCost) return null;
    const numericCost = Number(result.estimatedCost);
    const numericBudget = Number(form.budget);
    if (Number.isNaN(numericCost) || Number.isNaN(numericBudget)) return null;
    return numericCost <= numericBudget;
  }, [result, form.budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          people: Number(form.people),
          cookingTime: Number(form.cookingTime),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate a meal plan right now.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while creating your plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">AI Meal Planner</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">Smart Meal Planner</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Create a personalized day of meals with a grocery list and smart substitutions in seconds.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Powered by Gemini AI • Ready for Vercel deployment
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:p-6">
            <h2 className="text-xl font-semibold">Plan your meals</h2>
            <p className="mt-2 text-sm text-slate-400">Fill in your preferences and let AI craft a balanced plan for the day.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Budget (₹)</span>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    min="100"
                    className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none ring-0 focus:border-emerald-400"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Number of people</span>
                  <input
                    type="number"
                    name="people"
                    value={form.people}
                    onChange={handleChange}
                    min="1"
                    className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none ring-0 focus:border-emerald-400"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Diet</span>
                  <select
                    name="diet"
                    value={form.diet}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
                  >
                    {dietOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Cooking time</span>
                  <select
                    name="cookingTime"
                    value={form.cookingTime}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
                  >
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} mins
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Ingredients already available (optional)</span>
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Example: rice, tomatoes, spinach"
                  className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Generating plan...' : 'Generate Plan'}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:p-6">
            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/15 bg-slate-950/60">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                <p className="text-center text-sm text-slate-300">The AI is crafting your meal plan and grocery list...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div>
                    <p className="text-sm text-slate-400">Budget check</p>
                    <h3 className={`text-xl font-semibold ${isBudgetSafe ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {isBudgetSafe ? '✅ Within Budget' : '❌ Over Budget'}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-right text-sm text-slate-300">
                    <div>Budget: ₹{form.budget}</div>
                    <div>Estimated: ₹{result.estimatedCost}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { title: 'Breakfast', content: result.breakfast },
                    { title: 'Lunch', content: result.lunch },
                    { title: 'Dinner', content: result.dinner },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <h4 className="font-semibold text-emerald-200">{item.title}</h4>
                      <p className="mt-2 text-sm text-slate-300">{item.content}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <h4 className="font-semibold text-emerald-200">Grocery List</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {result.groceryList.split('\n').filter(Boolean).map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <h4 className="font-semibold text-emerald-200">Ingredient Substitutions</h4>
                  <p className="mt-2 text-sm text-slate-300">{result.substitutions}</p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                <p>Your generated meal plan will appear here.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
