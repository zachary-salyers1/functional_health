import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using default fonts for now)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica', fontWeight: 400 },
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  dateGenerated: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryCard: {
    width: '30%',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2563eb',
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 15,
  },
  categoryTag: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    fontSize: 8,
    padding: '4 8',
    borderRadius: 3,
  },
  interventionCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderLeft: 3,
    borderLeftColor: '#2563eb',
    borderRadius: 2,
  },
  interventionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  interventionNumber: {
    fontSize: 10,
    fontWeight: 700,
    color: '#64748b',
  },
  interventionBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    fontSize: 7,
    padding: '2 6',
    borderRadius: 2,
  },
  badgePrimary: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  badgeSecondary: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  badgeOptional: {
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
  },
  typeDietary: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  typeSupplement: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
  },
  typeLifestyle: {
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
  },
  typeExercise: {
    backgroundColor: '#fed7aa',
    color: '#9a3412',
  },
  typeSleep: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
  },
  interventionName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  interventionDescription: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 6,
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#334155',
    marginTop: 4,
    marginBottom: 2,
  },
  text: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 3,
  },
  detailsGrid: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 3,
    marginVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: '#64748b',
    width: '30%',
  },
  detailValue: {
    fontSize: 8,
    color: '#334155',
    width: '70%',
  },
  outcomeBox: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 3,
    marginVertical: 6,
  },
  outcomeTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 3,
  },
  outcomeText: {
    fontSize: 9,
    color: '#1e40af',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 3,
    marginTop: 6,
    borderLeft: 3,
    borderLeftColor: '#f59e0b',
  },
  warningTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 3,
  },
  warningText: {
    fontSize: 8,
    color: '#92400e',
  },
  disclaimer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    borderLeft: 4,
    borderLeftColor: '#f59e0b',
  },
  disclaimerTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#78350f',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
});

// Type definitions
type Intervention = {
  id: number;
  intervention_type: string;
  name: string;
  short_description: string;
  detailed_description: string;
  how_to_implement: string;
  dosage_info: string;
  frequency: string;
  timing: string;
  brand_recommendations: string;
  expected_outcome: string;
  difficulty_level: string;
  estimated_cost: string;
  contraindications: string;
  warnings: string;
};

type Recommendation = {
  id: string;
  priority_order: number;
  recommendation_strength: string;
  custom_rationale: string;
  expected_outcome: string;
  estimated_timeframe_days: number;
  interventions: Intervention;
};

type Protocol = {
  id: string;
  protocol_name: string;
  priority_focus: string;
  estimated_duration_days: number;
  retest_recommended_date: string;
  created_at: string;
  recommendations_by_type: {
    dietary: number;
    supplement: number;
    lifestyle: number;
    exercise: number;
    sleep: number;
  };
};

type ProtocolPDFProps = {
  protocol: Protocol;
  recommendations: Recommendation[];
  userName?: string;
};

const getTypeBadgeStyle = (type: string) => {
  const styles_map: { [key: string]: any } = {
    dietary: styles.typeDietary,
    supplement: styles.typeSupplement,
    lifestyle: styles.typeLifestyle,
    exercise: styles.typeExercise,
    sleep: styles.typeSleep,
  };
  return [styles.badge, styles_map[type] || styles.typeLifestyle];
};

const getStrengthBadgeStyle = (strength: string) => {
  const styles_map: { [key: string]: any } = {
    primary: styles.badgePrimary,
    secondary: styles.badgeSecondary,
    optional: styles.badgeOptional,
  };
  return [styles.badge, styles_map[strength] || styles.badgeOptional];
};

const InterventionCard: React.FC<{ rec: Recommendation }> = ({ rec }) => (
  <View style={styles.interventionCard} wrap={false}>
    {/* Header */}
    <View style={styles.interventionHeader}>
      <Text style={styles.interventionNumber}>#{rec.priority_order}</Text>
      <View style={styles.interventionBadges}>
        <Text style={getTypeBadgeStyle(rec.interventions.intervention_type)}>
          {rec.interventions.intervention_type.toUpperCase()}
        </Text>
        <Text style={getStrengthBadgeStyle(rec.recommendation_strength)}>
          {rec.recommendation_strength.toUpperCase()}
        </Text>
      </View>
    </View>

    {/* Intervention Name */}
    <Text style={styles.interventionName}>{rec.interventions.name}</Text>
    <Text style={styles.interventionDescription}>
      {rec.interventions.short_description}
    </Text>

    {/* Rationale */}
    <View style={{ marginTop: 6 }}>
      <Text style={styles.subsectionTitle}>Why This Matters:</Text>
      <Text style={styles.text}>{rec.custom_rationale}</Text>
    </View>

    {/* How to Implement */}
    <View style={{ marginTop: 4 }}>
      <Text style={styles.subsectionTitle}>How to Implement:</Text>
      <Text style={styles.text}>{rec.interventions.how_to_implement}</Text>
    </View>

    {/* Details Grid */}
    <View style={styles.detailsGrid}>
      {rec.interventions.dosage_info && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dosage:</Text>
          <Text style={styles.detailValue}>{rec.interventions.dosage_info}</Text>
        </View>
      )}
      {rec.interventions.frequency && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <Text style={styles.detailValue}>{rec.interventions.frequency}</Text>
        </View>
      )}
      {rec.interventions.timing && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timing:</Text>
          <Text style={styles.detailValue}>{rec.interventions.timing}</Text>
        </View>
      )}
      {rec.interventions.difficulty_level && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Difficulty:</Text>
          <Text style={styles.detailValue}>{rec.interventions.difficulty_level}</Text>
        </View>
      )}
      {rec.interventions.estimated_cost && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cost:</Text>
          <Text style={styles.detailValue}>{rec.interventions.estimated_cost}</Text>
        </View>
      )}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Timeline:</Text>
        <Text style={styles.detailValue}>{rec.estimated_timeframe_days} days</Text>
      </View>
    </View>

    {/* Brand Recommendations */}
    {rec.interventions.brand_recommendations && (
      <View style={{ marginTop: 4 }}>
        <Text style={styles.subsectionTitle}>Recommended Brands/Tools:</Text>
        <Text style={styles.text}>{rec.interventions.brand_recommendations}</Text>
      </View>
    )}

    {/* Expected Outcome */}
    <View style={styles.outcomeBox}>
      <Text style={styles.outcomeTitle}>Expected Outcome:</Text>
      <Text style={styles.outcomeText}>{rec.expected_outcome}</Text>
    </View>

    {/* Warnings */}
    {(rec.interventions.contraindications || rec.interventions.warnings) && (
      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Important Information</Text>
        {rec.interventions.contraindications && (
          <Text style={styles.warningText}>
            Contraindications: {rec.interventions.contraindications}
          </Text>
        )}
        {rec.interventions.warnings && (
          <Text style={styles.warningText}>
            Warnings: {rec.interventions.warnings}
          </Text>
        )}
      </View>
    )}
  </View>
);

export const ProtocolPDF: React.FC<ProtocolPDFProps> = ({
  protocol,
  recommendations,
  userName = 'Valued User',
}) => {
  const generatedDate = new Date(protocol.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const retestDate = new Date(protocol.retest_recommended_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      {/* Page 1: Cover and Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Personalized Health Protocol</Text>
          <Text style={styles.subtitle}>{protocol.protocol_name}</Text>
          <Text style={styles.dateGenerated}>
            Generated on {generatedDate} for {userName}
          </Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.text}>{protocol.priority_focus}</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Interventions</Text>
            <Text style={styles.summaryValue}>{recommendations.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Protocol Duration</Text>
            <Text style={styles.summaryValue}>{protocol.estimated_duration_days} days</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Retest By</Text>
            <Text style={styles.summaryValue}>{retestDate}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interventions by Category</Text>
          <View style={styles.categoryTags}>
            {protocol.recommendations_by_type.dietary > 0 && (
              <Text style={[styles.badge, styles.typeDietary]}>
                Dietary: {protocol.recommendations_by_type.dietary}
              </Text>
            )}
            {protocol.recommendations_by_type.supplement > 0 && (
              <Text style={[styles.badge, styles.typeSupplement]}>
                Supplements: {protocol.recommendations_by_type.supplement}
              </Text>
            )}
            {protocol.recommendations_by_type.lifestyle > 0 && (
              <Text style={[styles.badge, styles.typeLifestyle]}>
                Lifestyle: {protocol.recommendations_by_type.lifestyle}
              </Text>
            )}
            {protocol.recommendations_by_type.exercise > 0 && (
              <Text style={[styles.badge, styles.typeExercise]}>
                Exercise: {protocol.recommendations_by_type.exercise}
              </Text>
            )}
            {protocol.recommendations_by_type.sleep > 0 && (
              <Text style={[styles.badge, styles.typeSleep]}>
                Sleep: {protocol.recommendations_by_type.sleep}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Start Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start Guide</Text>
          <Text style={styles.text}>
            This protocol has been personalized based on your biomarker results. We recommend:
          </Text>
          <Text style={styles.text}>
            1. Read through all interventions carefully
          </Text>
          <Text style={styles.text}>
            2. Start with dietary and lifestyle changes (free, high impact)
          </Text>
          <Text style={styles.text}>
            3. Add supplements as recommended by priority order
          </Text>
          <Text style={styles.text}>
            4. Track your progress and retest on {retestDate}
          </Text>
          <Text style={styles.text}>
            5. Consult with your healthcare provider before making significant changes
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Functional Health Lab Analysis • Page 1
        </Text>
      </Page>

      {/* Page 2+: Detailed Interventions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Detailed Protocol</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Personalized Interventions</Text>
          {recommendations.map((rec, index) => (
            <InterventionCard key={rec.id} rec={rec} />
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This protocol is for educational and informational purposes only and is NOT medical
            advice, diagnosis, or treatment. Always consult with a qualified healthcare provider
            before starting any new supplements, dietary changes, or exercise programs. Inform
            your doctor of all medications and supplements you are taking to avoid potential
            interactions. This information has not been evaluated by the FDA and is not intended
            to diagnose, treat, cure, or prevent any disease. Individual results may vary.
          </Text>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Functional Health Lab Analysis • Page ${pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  );
};
