-- ============================================================================
-- INTERVENTIONS SEED DATA
-- ============================================================================
-- Created: November 11, 2025
-- Total Interventions: 35
-- Categories: dietary (12), supplement (12), lifestyle (6), exercise (3), sleep (2)
-- ============================================================================

-- ============================================================================
-- DIETARY INTERVENTIONS (12)
-- ============================================================================

INSERT INTO interventions (
  intervention_type, name, short_description, detailed_description,
  how_to_implement, dosage_info, frequency, timing, brand_recommendations,
  expected_outcome, typical_duration_days, expected_improvement_percentage,
  difficulty_level, estimated_cost, contraindications, warnings
) VALUES
(
  'dietary',
  'Low-Carbohydrate Diet (50-100g/day)',
  'Reduce daily carbohydrate intake to improve insulin sensitivity and glucose control',
  'A moderate low-carb diet restricting total daily carbohydrates to 50-100g, focusing on non-starchy vegetables, healthy fats, and adequate protein. This approach has been shown to significantly improve glycemic control and reduce insulin resistance.',
  'Track carbs with MyFitnessPal or Cronometer. Focus meals on: protein (4-6oz per meal), non-starchy vegetables (unlimited), healthy fats (avocado, olive oil, nuts). Limit grains, bread, pasta, sugary foods, and starchy vegetables. Example meal: Grilled salmon with roasted broccoli and olive oil.',
  'Total daily carbs: 50-100g',
  'Every meal, daily',
  'Throughout the day',
  'Apps: MyFitnessPal (Premium), Cronometer',
  'Expect HbA1c reduction of 0.5-1.0%, fasting glucose reduction of 10-30 mg/dL, and improved insulin sensitivity',
  90,
  20,
  'moderate',
  'medium ($50-100/mo for quality foods)',
  'Not suitable for type 1 diabetes without medical supervision. Consult doctor if on diabetes medications.',
  'May require medication adjustments. Monitor blood sugar closely if diabetic. Increase gradually to avoid "keto flu" symptoms.'
),
(
  'dietary',
  'Eliminate Ultra-Processed Foods',
  'Remove ultra-processed foods to reduce inflammation and improve metabolic health',
  'Eliminate foods with >5 ingredients, added sugars, artificial additives, preservatives, or industrial processing. Focus on whole, single-ingredient foods prepared at home.',
  'Read labels carefully. Avoid: packaged snacks, sugary cereals, processed meats, fast food, packaged baked goods, most frozen meals. Shop the perimeter of grocery stores. Meal prep on weekends. Choose: fresh vegetables, fruits, whole grains, legumes, nuts, seeds, fresh meat/fish.',
  'N/A',
  'Every meal, daily',
  'Throughout the day',
  'No specific brands - focus on whole foods from local grocers or farmers markets',
  'Reduced systemic inflammation, improved energy, better glucose control, potential weight loss of 5-10 lbs',
  60,
  15,
  'moderate',
  'medium ($50-100/mo)',
  'None - safe for all populations',
  'Requires meal planning and cooking skills. May increase grocery costs initially.'
),
(
  'dietary',
  'Mediterranean Diet Pattern',
  'Adopt Mediterranean-style eating to improve cardiovascular and metabolic health',
  'Emphasize olive oil, vegetables, fruits, whole grains, legumes, nuts, fish, and moderate wine. Limit red meat, processed foods, and added sugars. This pattern is extensively researched for cardiovascular and metabolic benefits.',
  'Build meals around: vegetables (5-7 servings/day), olive oil (3-4 tbsp daily), fish (2-3x/week), nuts (1 handful daily), whole grains, legumes. Limit red meat to 1-2x/month. Optional: 1 glass red wine with dinner. Use herbs and spices liberally.',
  'N/A - dietary pattern',
  'Every meal, daily',
  'Throughout the day',
  'Olive oil: California Olive Ranch, Kirkland Organic. Books: The Complete Mediterranean Cookbook',
  'Improved cholesterol (10-15% LDL reduction), reduced inflammation, better glucose control, cardiovascular protection',
  90,
  18,
  'easy',
  'medium ($60-120/mo)',
  'None - safe for all populations',
  'Quality olive oil can be expensive. Requires access to fresh fish and produce.'
),
(
  'dietary',
  'Time-Restricted Eating (16:8)',
  'Limit daily eating window to 8 hours to improve insulin sensitivity and metabolic health',
  'Fast for 16 hours daily, eat within an 8-hour window (e.g., 12pm-8pm). This circadian-aligned eating pattern improves insulin sensitivity, supports autophagy, and may aid weight management.',
  'Start eating window at noon, finish by 8pm. Stay hydrated during fasting (water, black coffee, tea). Break fast with balanced meal (protein + vegetables). Maintain normal calorie intake during eating window. Gradually extend fasting window if starting from 12-hour fast.',
  'Fasting: 16 hours, Eating: 8 hours',
  'Daily',
  'Example: Eat 12pm-8pm, Fast 8pm-12pm',
  'Apps: Zero (fasting tracker), LIFE Fasting Tracker',
  'Improved insulin sensitivity (15-25%), reduced fasting glucose (5-15 mg/dL), potential weight loss (5-10 lbs over 12 weeks), better energy',
  90,
  20,
  'easy',
  'free',
  'Not recommended during pregnancy/breastfeeding. Avoid if history of eating disorders. Consult doctor if on diabetes medications.',
  'May cause hunger initially (1-2 weeks adaptation). Ensure adequate nutrition during eating window. Monitor blood sugar if diabetic.'
),
(
  'dietary',
  'Increase Soluble Fiber (30g+/day)',
  'Consume 30+ grams of soluble fiber daily to improve glucose control and cholesterol',
  'Soluble fiber slows glucose absorption, feeds beneficial gut bacteria, and binds cholesterol. Target 30-40g total fiber daily with emphasis on soluble sources: oats, legumes, vegetables, fruits, nuts, seeds.',
  'Add fiber gradually to avoid digestive discomfort. Top sources: oats (3g per half cup), beans (6-8g per cup), chia seeds (10g per 2 tbsp), Brussels sprouts (4g per cup), avocado (5g per fruit). Spread throughout the day. Increase water intake.',
  '30-40g total fiber daily',
  'Every meal',
  'Throughout the day',
  'Supplements (if needed): Metamucil (psyllium), Bob Red Mill Oat Bran. Apps: Cronometer (tracks fiber)',
  'Improved glucose control (10-20% reduction in post-meal spikes), LDL cholesterol reduction (5-10%), better gut health, regular bowel movements',
  60,
  15,
  'easy',
  'low (<$30/mo)',
  'None - safe for all populations',
  'Increase gradually to avoid bloating/gas. Drink plenty of water (8-10 glasses daily). May reduce absorption of some medications - space 2 hours apart.'
),
(
  'dietary',
  'Eliminate Added Sugars (<25g/day)',
  'Reduce added sugar intake to less than 25g daily for improved metabolic health',
  'Added sugars (not naturally occurring sugars in fruit/dairy) drive insulin resistance and inflammation. WHO recommends <25g daily (6 teaspoons). Read labels for hidden sugars in sauces, dressings, yogurt, and healthy snacks.',
  'Check nutrition labels for "Added Sugars" line. Common sources to eliminate: soda, juice, sweetened coffee drinks, desserts, flavored yogurt, granola bars, ketchup/BBQ sauce. Use natural alternatives: fruit for sweetness, cinnamon, vanilla extract. Satisfy sweet tooth with berries, dark chocolate (85%+).',
  'Target: <25g added sugar daily (ideally <10g)',
  'Daily awareness, check all labels',
  'Throughout the day',
  'Apps: MyFitnessPal (tracks added sugar). Alternatives: Stevia, monk fruit (if needed)',
  'Reduced glucose spikes (20-30%), decreased inflammation, potential weight loss (5-15 lbs), stable energy, reduced sugar cravings after 2 weeks',
  30,
  25,
  'moderate',
  'free',
  'None - safe for all populations',
  'Expect sugar cravings for 1-2 weeks during transition. May experience temporary headaches or fatigue. Use fruit strategically to manage cravings.'
),
(
  'dietary',
  'Prioritize Protein (0.8-1.0g per lb bodyweight)',
  'Consume adequate protein to support muscle mass, satiety, and metabolic health',
  'Most adults need 0.8-1.0g protein per pound of ideal body weight daily. Protein increases satiety, supports muscle maintenance, has high thermic effect (burns calories during digestion), and stabilizes blood sugar.',
  'Calculate target: (Ideal bodyweight in lbs) × 0.8-1.0 = grams daily. Distribute across 3-4 meals (25-40g per meal). Top sources: chicken breast (30g per 4oz), Greek yogurt (20g per cup), eggs (6g each), salmon (25g per 4oz), whey protein (25g per scoop). Track with app initially.',
  '0.8-1.0g per lb ideal bodyweight',
  'Every meal (25-40g per meal)',
  'Distributed throughout the day',
  'Protein powders: Optimum Nutrition Gold Standard Whey, Orgain Organic. Apps: MyFitnessPal (tracks protein)',
  'Improved satiety and reduced cravings, maintained muscle mass during weight loss, stable blood sugar, modest metabolic boost (5-10%)',
  60,
  15,
  'easy',
  'medium ($40-80/mo)',
  'Reduce intake if advanced kidney disease. Consult doctor if kidney concerns.',
  'May increase grocery costs. Drink adequate water (8-10 glasses daily). Choose lean sources to avoid excess saturated fat.'
),
(
  'dietary',
  'Anti-Inflammatory Diet',
  'Emphasize anti-inflammatory foods to reduce chronic inflammation markers',
  'Focus on foods rich in omega-3s, antioxidants, and polyphenols while eliminating pro-inflammatory foods (refined carbs, trans fats, excess omega-6). Reduces systemic inflammation measured by CRP, IL-6.',
  'Include daily: fatty fish (salmon, sardines), colorful vegetables (5-7 servings), berries, olive oil, turmeric, ginger, green tea, nuts. Eliminate: fried foods, refined carbs, sugary beverages, excessive alcohol, processed meats. Consider: Mediterranean or plant-based pattern.',
  'N/A - dietary pattern',
  'Every meal, daily',
  'Throughout the day',
  'Books: The Anti-Inflammation Cookbook by Amanda Haas. Supplements to complement: Omega-3, Curcumin',
  'Reduced inflammatory markers (CRP reduction of 20-40%), improved energy, reduced joint pain, better recovery, enhanced immune function',
  90,
  20,
  'moderate',
  'medium ($60-100/mo)',
  'None - safe for all populations',
  'Results take 4-8 weeks to appear. Requires consistent adherence. May need to eliminate trigger foods individually.'
),
(
  'dietary',
  'Increase Omega-3 Rich Foods',
  'Consume fatty fish 2-3x/week to improve cardiovascular and inflammatory markers',
  'Omega-3 fatty acids (EPA/DHA) from fish reduce inflammation, improve triglycerides, and support heart health. Whole food sources are superior to supplements for most people.',
  'Eat fatty fish 2-3 times weekly: wild salmon (4-6oz), sardines (1 can), mackerel (4oz), herring (4oz). Canned fish is cost-effective and convenient. Add to salads, pasta, or eat standalone. Cooking: bake, grill, or air fry. Avoid deep frying.',
  '2-3 servings (4-6oz) weekly',
  '2-3x per week',
  'Any meal',
  'Wild-caught: Vital Choice, Safe Catch (canned tuna/salmon). Cooking: air fryer, parchment paper for baking',
  'Reduced triglycerides (15-30%), lower inflammation (CRP reduction 10-20%), cardiovascular protection, improved brain health',
  60,
  18,
  'easy',
  'medium ($40-80/mo)',
  'Avoid if fish allergy. Limit large fish (tuna, swordfish) if pregnant due to mercury.',
  'Choose wild-caught when possible. Canned fish (sardines, salmon) are economical alternatives. Pair with vegetables to balance meal.'
),
(
  'dietary',
  'Gluten-Free Diet (if indicated)',
  'Eliminate gluten to reduce inflammation and improve gut health for sensitive individuals',
  'For individuals with gluten sensitivity, Hashimoto thyroiditis, or autoimmune conditions, gluten elimination can reduce inflammation, improve thyroid function, and enhance gut health.',
  'Eliminate all wheat, barley, rye, and contaminated oats. Read labels carefully (gluten hides in sauces, soups, processed foods). Replace with: rice, quinoa, potatoes, gluten-free oats, almond/coconut flour. Focus on naturally gluten-free whole foods: vegetables, fruits, meat, fish, eggs, nuts, seeds, legumes.',
  'Complete elimination of gluten-containing grains',
  'Every meal, daily',
  'Throughout the day',
  'Gluten-free brands: Bob Red Mill, King Arthur GF Flour. Apps: Find Me Gluten Free (restaurant finder)',
  'Reduced inflammation and thyroid antibodies (TPOAb reduction 20-40% in Hashimoto), improved digestion, better energy, reduced brain fog',
  90,
  25,
  'moderate',
  'medium ($50-100/mo)',
  'Not necessary unless gluten sensitivity, celiac disease, or Hashimoto. Testing recommended before elimination.',
  'Gluten-free processed foods can be expensive and low in nutrients. Focus on whole foods. Ensure adequate fiber intake. Cross-contamination matters for celiac.'
),
(
  'dietary',
  'Reduce Sodium Intake (<2300mg/day)',
  'Limit sodium to improve blood pressure and reduce cardiovascular risk',
  'Excessive sodium increases blood pressure, fluid retention, and cardiovascular risk. Most sodium comes from processed foods, not the salt shaker. Target <2300mg daily (1 teaspoon salt).',
  'Read nutrition labels (target <200mg per serving). Cook at home to control sodium. Eliminate: processed meats, canned soups, restaurant meals, frozen dinners, chips/pretzels, cheese (high sodium). Flavor with: herbs, spices, lemon, garlic, vinegar. Rinse canned beans/vegetables.',
  'Target: <2300mg daily (ideally <1500mg)',
  'Daily awareness, check all labels',
  'Throughout the day',
  'Salt alternatives: Mrs. Dash, herbs, spices. Apps: MyFitnessPal (tracks sodium)',
  'Reduced blood pressure (5-10 mmHg systolic), decreased fluid retention, lower cardiovascular risk, improved kidney function',
  60,
  12,
  'moderate',
  'free',
  'None - beneficial for most populations. Increase if heavy sweater/athlete (consult doctor).',
  'Taste adaptation takes 2-4 weeks. Food may taste bland initially. Use herbs/spices generously. Some people are salt sensitive and see greater benefits.'
),
(
  'dietary',
  'Increase Green Leafy Vegetables (2+ servings/day)',
  'Consume 2+ servings of leafy greens daily for micronutrients and antioxidants',
  'Leafy greens (spinach, kale, Swiss chard, arugula, collards) are nutrient-dense, low-calorie sources of vitamins (K, folate, A, C), minerals (magnesium, iron), and antioxidants. Supports multiple health markers.',
  'Target 2-3 servings daily (1 serving = 1 cup raw or half cup cooked). Easy additions: smoothies (spinach), salads (mixed greens), sautéed (kale with garlic), steamed (Swiss chard). Vary types weekly. Pair with healthy fat (olive oil, avocado) to enhance nutrient absorption.',
  '2-3 servings daily (1 cup raw or half cup cooked)',
  'Daily, 2+ times',
  'Any meal',
  'Organic when possible (spinach, kale on Dirty Dozen list). Frozen is acceptable and cost-effective.',
  'Improved micronutrient status (vitamin K, folate, magnesium), reduced inflammation, better bone health, enhanced antioxidant status',
  60,
  10,
  'easy',
  'low (<$30/mo)',
  'If on blood thinners (warfarin), maintain consistent vitamin K intake - consult doctor before increasing greens.',
  'Oxalates in spinach can affect kidney stone formers - rotate greens. Wash thoroughly. Frozen greens are nutritious and convenient.'
);

-- ============================================================================
-- SUPPLEMENT INTERVENTIONS (12)
-- ============================================================================

INSERT INTO interventions (
  intervention_type, name, short_description, detailed_description,
  how_to_implement, dosage_info, frequency, timing, brand_recommendations,
  expected_outcome, typical_duration_days, expected_improvement_percentage,
  difficulty_level, estimated_cost, contraindications, warnings
) VALUES
(
  'supplement',
  'Berberine Supplementation',
  'Take berberine to improve insulin sensitivity and glucose control',
  'Berberine is a plant alkaloid with metformin-like effects on glucose metabolism. Multiple meta-analyses show significant reductions in fasting glucose, HbA1c, and insulin resistance. Works via AMPK activation.',
  'Take 500mg three times daily with meals (breakfast, lunch, dinner). Start with 500mg daily for 1 week to assess tolerance, then increase to full dose. Take consistently for at least 12 weeks. Can be long-term intervention.',
  '500mg three times daily (1500mg total)',
  '3x daily',
  'With meals (breakfast, lunch, dinner)',
  'Thorne Berberine-500, Integrative Therapeutics Berberine Complex. Look for 97%+ pure berberine HCl.',
  'HbA1c reduction of 0.7-1.0%, fasting glucose reduction of 15-30 mg/dL, improved lipid profile (10-15% triglyceride reduction)',
  90,
  25,
  'easy',
  'low ($20-30/mo)',
  'Avoid if pregnant/breastfeeding. Consult doctor if on diabetes medications (may enhance effects). Not recommended with certain antibiotics.',
  'Can cause digestive upset (diarrhea, constipation, gas) - take with meals and start low. May lower blood sugar - monitor if diabetic. Take 2 hours apart from other medications.'
),
(
  'supplement',
  'Vitamin D3 Supplementation',
  'Supplement with vitamin D3 to optimize levels and support immune function',
  'Vitamin D is a hormone critical for immune function, bone health, mood, and metabolic health. Most people are deficient (<30 ng/mL). Target optimal levels: 40-60 ng/mL.',
  'Take 2000-5000 IU daily with a meal containing fat (breakfast or lunch). Dose based on current levels: <20 ng/mL = 5000 IU, 20-30 ng/mL = 4000 IU, 30-40 ng/mL = 2000-3000 IU. Retest after 3 months to adjust. Year-round supplementation in most climates.',
  '2000-5000 IU daily (adjust based on blood levels)',
  'Once daily',
  'With a meal containing fat (breakfast or lunch)',
  'Thorne Vitamin D-5000, NOW Foods Vitamin D3 5000 IU. Choose D3 (cholecalciferol) not D2.',
  'Vitamin D levels increase to optimal range (40-60 ng/mL), improved immune function, better bone health, potential mood improvement',
  90,
  30,
  'easy',
  'low (<$15/mo)',
  'Rare: hypercalcemia with very high doses (>10,000 IU daily long-term). Monitor levels if taking >5000 IU daily.',
  'Take with fat-containing meal for absorption. Retest levels every 3-6 months initially. Can take 2-3 months to see level changes. Pair with vitamin K2 for optimal calcium metabolism.'
),
(
  'supplement',
  'Omega-3 Fish Oil (EPA/DHA)',
  'Supplement with high-quality fish oil to reduce inflammation and triglycerides',
  'Omega-3s (EPA/DHA) reduce inflammation, lower triglycerides, and support cardiovascular health. Effective when dietary fish intake is insufficient (<2 servings/week). Target: 2-3g EPA+DHA daily for therapeutic effects.',
  'Take 2-3g combined EPA+DHA daily with meals. Choose high-quality, third-party tested brands (IFOS certified). Refrigerate after opening. Take with food to enhance absorption and reduce fishy burps. Can split dose morning/evening.',
  '2-3g combined EPA+DHA daily',
  'Once or twice daily',
  'With meals (morning and/or evening)',
  'Nordic Naturals Ultimate Omega, Carlson Elite Omega-3, Wiley Finest Peak EPA. Look for IFOS certification.',
  'Reduced triglycerides (20-30%), lower inflammation (CRP reduction 10-20%), cardiovascular protection, potential mood benefits',
  90,
  20,
  'easy',
  'medium ($30-50/mo)',
  'Consult doctor if on blood thinners (can increase bleeding risk at high doses). Avoid if fish allergy.',
  'Choose molecularly distilled to avoid contaminants. Refrigerate. May cause fishy aftertaste - try enteric-coated or freezing capsules. High doses (>3g) should be supervised.'
),
(
  'supplement',
  'Magnesium Glycinate Supplementation',
  'Supplement with magnesium to support insulin sensitivity, sleep, and relaxation',
  'Magnesium is involved in 300+ enzymatic reactions including glucose metabolism and insulin signaling. Most people consume inadequate amounts. Glycinate form is well-absorbed and gentle on digestion.',
  'Take 200-400mg magnesium (elemental) as glycinate before bed. Start with 200mg for 1 week, increase to 400mg if tolerated. Avoid taking with calcium supplements (competes for absorption). Can also help with sleep quality.',
  '200-400mg elemental magnesium as glycinate',
  'Once daily',
  'Before bed (30-60 minutes)',
  'Thorne Magnesium Bisglycinate, Pure Encapsulations Magnesium Glycinate, Doctor Best High Absorption Magnesium',
  'Improved insulin sensitivity (10-15%), better sleep quality, reduced muscle cramps, improved bowel regularity, reduced stress/anxiety',
  60,
  15,
  'easy',
  'low ($15-25/mo)',
  'Reduce dose if kidney disease. Start low if prone to diarrhea.',
  'Glycinate is gentle on stomach (avoid oxide/citrate if diarrhea-prone). Can cause loose stools at high doses - reduce if needed. Take 2 hours apart from thyroid medication.'
),
(
  'supplement',
  'Selenium Supplementation (for Hashimoto)',
  'Supplement with selenium to reduce thyroid antibodies and support thyroid function',
  'Selenium is critical for thyroid hormone metabolism and immune function. Supplementation significantly reduces TPOAb and TGAb antibodies in Hashimoto thyroiditis. Multiple RCTs demonstrate efficacy.',
  'Take 200mcg selenium as selenomethionine daily with food. Take consistently for at least 6 months - effects on antibodies take 3-6 months. Do not exceed 400mcg daily (toxicity risk). Pair with vitamin D and gluten elimination for best results.',
  '200mcg daily as selenomethionine',
  'Once daily',
  'With any meal',
  'Thorne Selenium, Pure Encapsulations Selenium, NOW Foods Selenium. Choose selenomethionine form.',
  'TPOAb and TGAb reduction of 20-50%, improved TSH, better thyroid function, potential reduction in thyroid medication needs',
  180,
  30,
  'easy',
  'low (<$10/mo)',
  'Do not exceed 400mcg daily (toxicity: hair loss, nail problems). Not for use without Hashimoto diagnosis unless deficient.',
  'Effects take 3-6 months. Retest thyroid antibodies at 6 months. Brazil nuts provide selenium but amounts vary (not reliable). Too much selenium is toxic - stick to recommended dose.'
),
(
  'supplement',
  'Vitamin B Complex (Methylated)',
  'Supplement with B-complex to support energy, methylation, and homocysteine metabolism',
  'B vitamins (especially B6, B9/folate, B12) are critical for energy production, methylation, and cardiovascular health. Methylated forms (methylfolate, methylcobalamin) are better absorbed, especially for those with MTHFR variants.',
  'Take 1 capsule of methylated B-complex daily with breakfast. Choose formula with: methylfolate (not folic acid), methylcobalamin (B12), P-5-P (B6). Avoid high-dose B6 (>50mg) long-term. Can take indefinitely.',
  '1 capsule daily (multi-B formula)',
  'Once daily',
  'With breakfast',
  'Thorne B-Complex #12, Pure Encapsulations B-Complex Plus, Seeking Health Optimal Multivitamin (includes methylated Bs)',
  'Improved energy, lower homocysteine (10-20% reduction), better mood, support for methylation and detoxification',
  60,
  15,
  'easy',
  'low ($20-30/mo)',
  'High-dose B6 (>100mg) can cause neuropathy long-term. Avoid if allergic to any B vitamins.',
  'Urine may turn bright yellow (riboflavin - harmless). Take with food to avoid nausea. Methylated forms are superior but slightly more expensive.'
),
(
  'supplement',
  'Curcumin (Turmeric Extract)',
  'Supplement with bioavailable curcumin to reduce inflammation',
  'Curcumin is the active compound in turmeric with potent anti-inflammatory effects. Reduces inflammatory markers (CRP, IL-6) and benefits multiple health conditions. Poor absorption - requires enhanced bioavailability.',
  'Take 500-1000mg curcumin (with piperine or liposomal form for absorption) 1-2x daily with meals. Choose enhanced bioavailability forms: curcumin + piperine (black pepper extract), or liposomal/phytosome curcumin. Take for at least 8-12 weeks.',
  '500-1000mg curcumin 1-2x daily',
  '1-2x daily',
  'With meals',
  'Thorne Meriva-SF (phytosome), Life Extension Super Bio-Curcumin, Transparent Labs Curcumin C3 Complex',
  'Reduced inflammation (CRP reduction 20-30%), improved joint health, potential cognitive benefits, antioxidant support',
  90,
  20,
  'easy',
  'medium ($25-40/mo)',
  'Avoid if on blood thinners (can enhance effects). May interact with some medications - consult pharmacist.',
  'Choose enhanced absorption forms (piperine, phytosome, liposomal). Can cause digestive upset - take with food. May stain clothes yellow. Effects take 4-8 weeks.'
),
(
  'supplement',
  'Probiotic Supplementation',
  'Take multi-strain probiotic to support gut health and immune function',
  'Probiotics support healthy gut microbiome, improve digestion, enhance immune function, and may improve metabolic markers. Choose multi-strain formulas with 10+ billion CFU. Especially beneficial after antibiotics or with digestive issues.',
  'Take 10-50 billion CFU multi-strain probiotic daily on empty stomach (morning before breakfast) or before bed. Refrigerate if required. Rotate brands every 3 months for bacterial diversity. Pair with prebiotic fiber foods.',
  '10-50 billion CFU daily, multi-strain',
  'Once daily',
  'Empty stomach (morning or before bed)',
  'Garden of Life Dr. Formulated Probiotics, Klaire Labs Ther-Biotic Complete, VSL#3 (high-potency)',
  'Improved digestion, enhanced immune function, potential metabolic benefits (modest glucose/lipid improvements), better gut health',
  90,
  12,
  'easy',
  'medium ($30-50/mo)',
  'Avoid if severely immunocompromised. Consult doctor if central line or serious illness.',
  'May cause gas/bloating first 1-2 weeks (start low dose). Refrigerate shelf-stable varieties for longer life. Quality varies by brand - choose reputable sources.'
),
(
  'supplement',
  'Coenzyme Q10 (CoQ10)',
  'Supplement with CoQ10 to support mitochondrial function and cardiovascular health',
  'CoQ10 is a vital antioxidant and electron transporter in mitochondria, essential for energy production. Levels decline with age and statin use. Supports cardiovascular health, energy, and may reduce statin side effects.',
  'Take 100-200mg CoQ10 (ubiquinone or ubiquinol form) daily with a meal containing fat. Ubiquinol is the active form and better absorbed, especially for those >40 or on statins. Take in morning or split dose (am/pm).',
  '100-200mg daily (ubiquinol preferred)',
  'Once daily',
  'With a fat-containing meal (breakfast)',
  'Thorne Q-Best 100, Jarrow Formulas QH-Absorb (ubiquinol), Qunol Mega CoQ10',
  'Improved energy and mitochondrial function, cardiovascular support, reduced statin side effects (muscle pain), antioxidant protection',
  90,
  15,
  'easy',
  'medium ($30-50/mo)',
  'Generally safe. May interact with blood thinners - consult doctor.',
  'Ubiquinol is more expensive but better absorbed. Take with fat for absorption. Benefits take 4-8 weeks. Essential if on statins (depletes CoQ10).'
),
(
  'supplement',
  'Myo-Inositol Supplementation',
  'Supplement with myo-inositol to improve insulin sensitivity and support PCOS/metabolic health',
  'Myo-inositol improves insulin signaling and is particularly effective for PCOS, metabolic syndrome, and insulin resistance. Works as an insulin sensitizer similar to metformin but with fewer side effects.',
  'Take 2-4g myo-inositol daily in divided doses (1-2g morning, 1-2g evening). Mix powder in water or smoothie. Take for at least 12 weeks to see full metabolic benefits. Can combine with 200mcg selenium for Hashimoto.',
  '2-4g daily in divided doses',
  '2x daily',
  'Morning and evening (can mix in water/smoothie)',
  'Thorne Myo-Inositol, Ovasitol (myo + d-chiro blend), Wholesome Story Inositol Powder',
  'Improved insulin sensitivity (15-25%), reduced fasting glucose and insulin, improved ovulation in PCOS, potential weight loss support',
  90,
  20,
  'easy',
  'low ($20-35/mo)',
  'Generally very safe. Mild digestive effects possible at high doses.',
  'Powder form is most economical. Can cause mild nausea or digestive upset - take with food if needed. Benefits take 8-12 weeks. Well-tolerated.'
),
(
  'supplement',
  'Alpha-Lipoic Acid (ALA)',
  'Supplement with ALA to improve insulin sensitivity and provide antioxidant support',
  'Alpha-lipoic acid is a powerful antioxidant that improves insulin sensitivity and glucose uptake. Also supports mitochondrial function and may reduce diabetic neuropathy symptoms. Both water and fat-soluble.',
  'Take 300-600mg ALA daily on empty stomach (30 min before breakfast or 2 hours after meals). R-lipoic acid is the active form. Start with 300mg daily for 1 week, increase to 600mg if tolerated. Take for at least 12 weeks.',
  '300-600mg daily',
  'Once daily',
  'Empty stomach (30 min before breakfast)',
  'Thorne Alpha-Lipoic Acid, Doctor Best Alpha-Lipoic Acid, Life Extension Super R-Lipoic Acid',
  'Improved insulin sensitivity (10-20%), reduced fasting glucose (5-15 mg/dL), antioxidant protection, potential reduction in neuropathy symptoms',
  90,
  18,
  'moderate',
  'medium ($25-40/mo)',
  'May lower blood sugar - monitor if diabetic and on medications. Rare: can affect thyroid function - monitor TSH.',
  'Take on empty stomach for best absorption. May cause low blood sugar - start low if diabetic. Can cause mild stomach upset. R-lipoic acid is more expensive but more potent.'
),
(
  'supplement',
  'Zinc Supplementation',
  'Supplement with zinc to support immune function and insulin sensitivity',
  'Zinc is essential for immune function, insulin signaling, and thyroid hormone metabolism. Many people are mildly deficient. Supports glucose control and thyroid health.',
  'Take 15-30mg elemental zinc daily with food (evening meal). Choose zinc picolinate or glycinate for better absorption. Do not exceed 40mg daily long-term. Take 2 hours apart from thyroid medication. Pair with copper if taking >30mg long-term (2mg copper per 30mg zinc).',
  '15-30mg elemental zinc daily',
  'Once daily',
  'With evening meal',
  'Thorne Zinc Picolinate 30mg, Pure Encapsulations Zinc 30, NOW Foods Zinc Glycinate',
  'Improved immune function, better glucose control (modest 5-10% improvement), support for thyroid function, potential skin/hair benefits',
  90,
  12,
  'easy',
  'low ($10-15/mo)',
  'High doses (>40mg daily) can cause copper deficiency and immune suppression. Take with food to avoid nausea.',
  'Take with food to prevent nausea. Can interfere with copper absorption - add copper if taking high doses long-term. Separate from thyroid medication by 2 hours.'
);

-- ============================================================================
-- LIFESTYLE INTERVENTIONS (6)
-- ============================================================================

INSERT INTO interventions (
  intervention_type, name, short_description, detailed_description,
  how_to_implement, dosage_info, frequency, timing, brand_recommendations,
  expected_outcome, typical_duration_days, expected_improvement_percentage,
  difficulty_level, estimated_cost, contraindications, warnings
) VALUES
(
  'lifestyle',
  'Stress Management (Meditation/Mindfulness)',
  'Practice daily meditation or mindfulness to reduce cortisol and improve metabolic health',
  'Chronic stress elevates cortisol, drives insulin resistance, and impairs immune function. Regular meditation/mindfulness reduces stress hormones, inflammation, and improves multiple health markers.',
  'Start with 5-10 minutes daily, gradually increase to 20 minutes. Options: guided meditation apps (Headspace, Calm), mindfulness breathing (box breathing: 4-4-4-4), body scan meditation, yoga nidra. Best time: morning upon waking or before bed. Consistency > duration.',
  '10-20 minutes daily',
  'Daily',
  'Morning upon waking or before bed',
  'Apps: Headspace, Calm, Insight Timer (free), Waking Up. Books: The Relaxation Response by Herbert Benson',
  'Reduced cortisol and stress hormones (15-25%), lower blood pressure (5-10 mmHg), improved sleep, reduced anxiety, better glucose control',
  60,
  18,
  'easy',
  'low ($5-15/mo for apps, or free)',
  'None - safe for all populations',
  'Benefits accumulate over time - commit to 8 weeks minimum. Start small (5 min) to build habit. Use apps for guidance initially. Morning practice sets tone for day.'
),
(
  'lifestyle',
  'Cold Exposure Therapy',
  'Practice cold showers or ice baths to improve metabolic health and resilience',
  'Cold exposure activates brown adipose tissue (burns calories), improves insulin sensitivity, reduces inflammation, and builds stress resilience. Accessible biohack with growing research support.',
  'Start with 30-60 seconds cold water at end of normal shower. Gradually increase to 2-3 minutes of cold-only shower. Advanced: ice baths (10-15 min at 50-60°F). Do 3-5x per week. Morning is ideal for energy boost. Breathe slowly and deeply.',
  '30 seconds - 3 minutes cold exposure',
  '3-5x per week',
  'Morning (end of shower)',
  'No equipment needed. Advanced: ice bath tubs, cold plunge pools (The Cold Plunge, Morozko Forge)',
  'Improved insulin sensitivity (10-15%), increased calorie burn, reduced inflammation, enhanced mood and energy, improved stress resilience',
  60,
  15,
  'moderate',
  'free',
  'Avoid if cardiovascular disease, Raynaud, severe hypertension - consult doctor. Start very gradually.',
  'Start with just 30 seconds. Breathe calmly (avoid hyperventilation). Never alone if doing ice baths. Warm up gradually after. Not suitable for everyone - listen to your body.'
),
(
  'lifestyle',
  'Optimize Sleep Hygiene',
  'Improve sleep quality to enhance metabolic health and recovery',
  'Sleep is foundational for metabolic health. Poor sleep drives insulin resistance, increases cortisol, impairs immune function, and disrupts hunger hormones (leptin/ghrelin). Target 7-9 hours nightly.',
  'Sleep routine: (1) Consistent schedule (bed/wake same time daily), (2) Dark, cool room (65-68°F), (3) No screens 1 hour before bed, (4) Avoid caffeine after 2pm, (5) No alcohol 3 hours before bed, (6) Morning sunlight exposure (10 min), (7) Consider magnesium glycinate before bed.',
  '7-9 hours nightly',
  'Every night',
  'Consistent bedtime (e.g., 10pm-6am)',
  'Tools: blackout curtains, eye mask, white noise machine, Oura Ring/WHOOP (sleep tracking), blue light blocking glasses',
  'Improved glucose control (10-20%), better insulin sensitivity, reduced inflammation, normalized hunger hormones, improved energy and mood',
  30,
  20,
  'moderate',
  'low-medium ($50-200 for tools)',
  'None - beneficial for all',
  'Consistency is key - stick to schedule even on weekends. Avoid revenge bedtime procrastination. Address sleep apnea if suspected (snoring, fatigue despite adequate hours).'
),
(
  'lifestyle',
  'Sunlight Exposure (Morning + Midday)',
  'Get daily sunlight exposure to optimize vitamin D, circadian rhythm, and mood',
  'Morning sunlight sets circadian rhythm, improves sleep, and boosts mood. Midday sun (10am-2pm) supports vitamin D production. Essential for metabolic and mental health.',
  'Get 10-30 minutes of direct sunlight exposure daily: (1) Morning sunlight within 1 hour of waking (even if cloudy) - resets circadian clock, (2) Midday sun (10am-2pm) for vitamin D - expose arms/legs, no sunscreen for 10-15 min (adjust for skin type). More time needed in winter or higher latitudes.',
  '10-30 minutes daily (morning + optional midday)',
  'Daily',
  'Morning (within 1hr of waking) + optional midday',
  'No equipment needed. Optional: light therapy lamp (10,000 lux) for winter or early wake times',
  'Improved circadian rhythm and sleep quality, better mood, vitamin D production, improved insulin sensitivity, reduced depression risk',
  30,
  15,
  'easy',
  'free',
  'Avoid excessive midday sun if skin cancer risk. Use sunscreen after 15 minutes of unprotected exposure.',
  'Morning light is most important for circadian rhythm (even through clouds). Cannot get vitamin D through windows. Midday sun duration varies by latitude, season, skin tone.'
),
(
  'lifestyle',
  'Reduce Alcohol Consumption (≤3 drinks/week)',
  'Limit alcohol intake to improve liver function, sleep, and metabolic health',
  'Alcohol disrupts sleep quality, impairs glucose control, increases inflammation, and burdens liver detoxification. Even moderate intake (4-7 drinks/week) impacts health markers. Reduction often yields quick improvements.',
  'Reduce to ≤3 drinks per week maximum (ideally 0-1). Choose quality over quantity if drinking: red wine (antioxidants), avoid sugary mixers. Never drink 3 hours before bed (disrupts sleep). Track with app if needed. Consider alcohol-free alternatives (Athletic Brewing, Seedlip spirits).',
  '≤3 drinks per week (ideally 0-1)',
  'Weekly limit',
  'Never within 3 hours of bed',
  'Alternatives: Athletic Brewing (non-alcoholic beer), Seedlip (non-alcoholic spirits), sparkling water with lime',
  'Improved sleep quality (30-50%), better glucose control (5-15%), reduced inflammation, improved liver enzymes (AST/ALT), better energy, potential weight loss',
  30,
  20,
  'moderate',
  'free (saves money)',
  'None - reduction beneficial for all',
  'Alcohol disrupts REM sleep even if helps falling asleep. Most noticeable impact: sleep quality and morning energy. Social situations may require planning alternatives.'
),
(
  'lifestyle',
  'Digital Detox / Screen Time Reduction',
  'Reduce recreational screen time to improve sleep, stress, and mental health',
  'Excessive screen time (especially before bed) disrupts circadian rhythm via blue light, increases stress, impairs sleep quality, and reduces time for healthy behaviors (exercise, cooking, social connection).',
  'Implement boundaries: (1) No screens 1 hour before bed, (2) Keep phone out of bedroom, (3) Limit social media to 30 min/day, (4) No screens during meals, (5) Use Screen Time or Digital Wellbeing app limits. Replace with: reading, walking, cooking, face-to-face connection.',
  'Reduce recreational screen time by 50%',
  'Daily boundaries',
  'Especially 1 hour before bed',
  'Tools: iOS Screen Time, Android Digital Wellbeing, Freedom app (blocks sites), blue light blocking glasses (evening)',
  'Improved sleep quality (20-30%), reduced stress and anxiety, better mood, more time for healthy behaviors, improved focus',
  30,
  18,
  'moderate',
  'free',
  'None - beneficial for all',
  'Start with one boundary (e.g., phone out of bedroom). Track screen time first week to establish baseline. Replace screen time with specific alternative (reading book, walking). Social connection is key motivator.'
);

-- ============================================================================
-- EXERCISE INTERVENTIONS (3)
-- ============================================================================

INSERT INTO interventions (
  intervention_type, name, short_description, detailed_description,
  how_to_implement, dosage_info, frequency, timing, brand_recommendations,
  expected_outcome, typical_duration_days, expected_improvement_percentage,
  difficulty_level, estimated_cost, contraindications, warnings
) VALUES
(
  'exercise',
  'Resistance Training (2-3x/week)',
  'Perform strength training to improve insulin sensitivity and metabolic health',
  'Resistance training builds muscle mass, improves insulin sensitivity, increases metabolic rate, and enhances glucose disposal. Superior to aerobic exercise alone for metabolic health. Essential for longevity.',
  'Train 2-3x per week (full-body or split). Each session: 30-45 minutes, 6-8 exercises, 3 sets of 8-12 reps. Focus on compound movements: squats, deadlifts, rows, presses, lunges. Progressive overload: gradually increase weight/reps. Rest 1-2 days between sessions. Hire trainer initially if new to lifting.',
  '2-3 sessions per week, 30-45 min each',
  '2-3x per week',
  'Any time (morning or evening)',
  'Programs: StrongLifts 5x5 (app), Starting Strength (book). Equipment: gym membership or home dumbbells/resistance bands',
  'Improved insulin sensitivity (25-40%), increased muscle mass, higher metabolic rate, better glucose control, stronger bones, enhanced functional capacity',
  90,
  30,
  'moderate',
  'medium ($30-100/mo for gym or equipment)',
  'Consult doctor if cardiovascular disease, recent injury, or osteoporosis. Start light and progress gradually.',
  'Form is critical - consider trainer for first 4-6 sessions. Start light (bodyweight or light weights). Soreness is normal initially. Protein intake important for recovery (0.8-1g per lb).'
),
(
  'exercise',
  'Zone 2 Cardio (150+ min/week)',
  'Perform moderate-intensity aerobic exercise to improve metabolic health',
  'Zone 2 cardio (conversational pace, ~60-70% max heart rate) improves mitochondrial function, insulin sensitivity, and fat oxidation. Superior to high-intensity for metabolic health and sustainable long-term.',
  'Accumulate 150+ minutes weekly of Zone 2 exercise: brisk walking, jogging, cycling, swimming, rowing. Zone 2 = can hold conversation but breathing elevated. Target heart rate: (220-age) × 0.6-0.7. Break into manageable chunks: 30 min 5x/week or 50 min 3x/week. Can combine with podcasts/audiobooks.',
  '150+ minutes per week',
  '3-5x per week',
  'Any time (morning preferred for consistency)',
  'Apps: Strava, Apple Fitness. Devices: heart rate monitor (Polar H10), smartwatch. Activities: walking, jogging, cycling',
  'Improved insulin sensitivity (15-25%), better mitochondrial function, increased fat oxidation, enhanced cardiovascular health, improved endurance',
  90,
  22,
  'easy',
  'low-medium ($0-50/mo)',
  'Consult doctor if cardiovascular disease. Start gradually if sedentary.',
  'Stay in Zone 2 (avoid going too hard). Consistency > intensity. Build gradually if sedentary (start with 60 min/week). Walking counts! Morning exercise improves adherence.'
),
(
  'exercise',
  'Post-Meal Walks (10-15 min)',
  'Take short walks after meals to reduce glucose spikes',
  'Brief walks after eating significantly reduce post-meal glucose spikes by enhancing glucose uptake into muscles. Highly effective, accessible intervention for improving glycemic control. Works synergistically with dietary changes.',
  'Walk for 10-15 minutes within 30 minutes after meals (especially dinner). Casual pace is sufficient. Prioritize after largest meal of day (typically dinner). Can be gentle (around block, in house). Consistency matters more than intensity or duration.',
  '10-15 minutes after meals',
  'Daily (at least 1x, ideally 2-3x after main meals)',
  'Within 30 min after eating',
  'No equipment needed. Optional: pedometer/step tracker (Apple Watch, Fitbit)',
  'Reduced post-meal glucose spikes (20-30%), improved overall glycemic control, better insulin sensitivity, aids digestion, gentle daily movement',
  30,
  25,
  'easy',
  'free',
  'None - safe for all populations including elderly and pregnant',
  'Even 10 minutes makes a difference. Walking after dinner is most impactful (largest meal). Can walk indoors in bad weather. Great habit to build with family.'
);

-- ============================================================================
-- SLEEP INTERVENTIONS (2)
-- ============================================================================

INSERT INTO interventions (
  intervention_type, name, short_description, detailed_description,
  how_to_implement, dosage_info, frequency, timing, brand_recommendations,
  expected_outcome, typical_duration_days, expected_improvement_percentage,
  difficulty_level, estimated_cost, contraindications, warnings
) VALUES
(
  'sleep',
  'Sleep Optimization Protocol',
  'Implement comprehensive sleep hygiene to maximize sleep quality and metabolic recovery',
  'Sleep is the foundation of metabolic health. This comprehensive protocol addresses all aspects: environment, timing, behaviors, and supplements. Targets 7-9 hours of high-quality sleep nightly.',
  'Implement: (1) Consistent schedule (±30 min every day), (2) Environment: dark (blackout curtains/mask), cool (65-68°F), quiet (white noise if needed), (3) Pre-bed routine: dim lights 2 hours before, no screens 1 hour before, hot shower/bath, reading, (4) Avoid: caffeine after 2pm, alcohol 3 hours before bed, large meals 3 hours before, (5) Morning: sunlight within 1 hour, (6) Supplements: magnesium glycinate 400mg 1 hour before bed.',
  '7-9 hours nightly with optimal conditions',
  'Every night',
  'Consistent bedtime (e.g., 10:30pm)',
  'Tools: Oura Ring (sleep tracking), Eight Sleep (temp control mattress), blackout curtains, white noise machine, Magnesium glycinate',
  'Improved sleep quality and duration, better glucose control (15-25%), reduced cortisol, enhanced recovery, normalized hunger hormones, improved energy and cognition',
  30,
  25,
  'moderate',
  'medium ($100-300 for tools, $15/mo for magnesium)',
  'None - beneficial for all',
  'Results take 2-4 weeks of consistency. Prioritize schedule consistency first. Consider sleep study if snoring/apnea suspected. Avoid sleep medications - address root causes.'
),
(
  'sleep',
  'Circadian Rhythm Optimization',
  'Align daily behaviors with circadian biology to improve sleep and metabolic health',
  'Circadian rhythm governs sleep-wake cycles, hormone release, and metabolism. Modern life disrupts this ancient system. Realigning to natural light-dark cycles dramatically improves sleep, energy, and health markers.',
  'Daily protocol: (1) Morning: Bright light exposure within 30 min of waking (10-30 min outside or 10k lux light box), (2) Daytime: Bright environment, time outside, (3) Evening: Dim lights 2-3 hours before bed, avoid blue light (screens/LEDs), use warm/red lights, consider blue-blocking glasses, (4) Night: Complete darkness (blackout curtains, eye mask, cover LEDs), (5) Consistent timing: wake/sleep within 30 min daily, eat within 10-hour window.',
  'Full protocol daily',
  'Every day',
  'Throughout day (morning light most critical)',
  'Light therapy: Circadian Optics Lumos 2.0 (10k lux), Blue blockers: TrueDark, Ra Optics. Apps: f.lux (computer), Night Shift (iOS)',
  'Improved sleep quality (30-40%), better energy and alertness, normalized cortisol rhythm, improved glucose control, enhanced mood, better digestion',
  30,
  28,
  'moderate',
  'low-medium ($50-150 for tools)',
  'None - beneficial for all',
  'Morning light is most critical intervention (even 5-10 min helps). Can use 10k lux light box if early wake/winter. Blue blockers help evening but less important than morning light. Consistency > perfection.'
);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total interventions: 35
-- By category:
--   - Dietary: 12
--   - Supplement: 12
--   - Lifestyle: 6
--   - Exercise: 3
--   - Sleep: 2
--
-- Cost distribution:
--   - Free: 7 interventions
--   - Low (<$30/mo): 10 interventions
--   - Medium ($30-100/mo): 16 interventions
--   - High (>$100/mo): 2 interventions (one-time costs)
--
-- Difficulty distribution:
--   - Easy: 20 interventions
--   - Moderate: 15 interventions
--   - Advanced: 0 interventions
--
-- Expected improvement: 12-30% per intervention (varies by marker)
-- Typical duration: 30-180 days (most at 60-90 days)
