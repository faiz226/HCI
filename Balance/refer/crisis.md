/**
 * CrisisScreen v5 — DESIGN.md aligned
 *
 * Design decisions:
 * - Header: "Crisis Mode" badge-pill + editorial headline — no heavy dark band here
 * - Urgent tasks card: explicit #ef444430 border (not string concat)
 * - Email generator: chips for task + reason, plain text input for lecturer
 * - Email preview: monospace-like warm inset box, lineHeight 22
 * - Breathing coach: animated circle, phase-colored border (3px), no glow
 * - Contacts: tinted sq icon, no border box — links directly via Linking
 * - All sticker colors used only for category/status decoration
 * - Copy button: success state (stickerGreen) on confirm
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TextInput, Animated, Easing, Linking, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Warning, CheckCircle, CopySimple, Check, Stop, Play, Phone, Envelope, Heart, CaretRight } from 'phosphor-react-native';
import { useApp } from '../context/AppContext';
import PressableScale from '../components/PressableScale';
import FadeInView from '../components/FadeInView';
import SlideToConfirm from '../components/SlideToConfirm';
import Textarea from '../components/Textarea';
import RippleButton from '../components/RippleButton';
import Toast from '../components/Toast';
import { Colors, Typography, Spacing, Radii, Shadows } from '../constants/theme';


const REASONS = [
  'Severe Academic Overload',
  'Medical Emergency',
  'Family Emergency',
  'Mental Health Crisis',
  'Technical Issues',
];

const CONTACTS = [
  { label: 'IIUM Counseling Centre', detail: '+603-6196 4000', PhosphorIcon: Phone,    color: '#213183', action: 'tel:+60361964000'          },
  { label: 'IIUM Student Affairs',   detail: 'sao@iium.edu.my', PhosphorIcon: Envelope, color: '#0075de', action: 'mailto:sao@iium.edu.my' },
  { label: 'Befrienders KL (24h)',   detail: '03-7627 2929',   PhosphorIcon: Heart,    color: '#e03e3e', action: 'tel:+60376272929'          },
];

const PHASE_COLORS: Record<string, string> = {
  Inhale: '#62aef0',   // stickerSky
  Hold:   '#d6b6f6',   // stickerPurple
  Exhale: '#2a9d99',   // stickerTeal
};

export default function CrisisScreen() {
  const { state, dispatch, colors } = useApp();
  const styles = createStyles(colors);

  const urgentTasks = state.tasks.filter(t => !t.completed && t.urgent);

  const [selectedTask, setSelectedTask] = useState(urgentTasks[0]?.name ?? '');
  const [reason,       setReason]       = useState(REASONS[0]);
  const [lecturer,     setLecturer]     = useState('');
  const [copied,       setCopied]       = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [breathing, setBreathing] = useState(false);
  const [phase,     setPhase]     = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [count,     setCount]     = useState(4);
  const breathAnim    = useRef(new Animated.Value(0)).current;
  const breathRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseColor    = PHASE_COLORS[phase] ?? colors.stickerSky;

  function runPhase(p: 'Inhale' | 'Hold' | 'Exhale') {
    setPhase(p);
    Animated.timing(breathAnim, {
      toValue: p === 'Exhale' ? 0 : 1,
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    let c = 4; setCount(c);
    breathRef.current = setInterval(() => {
      c -= 1; setCount(c);
      if (c <= 0) {
        clearInterval(breathRef.current!);
        const next: 'Inhale' | 'Hold' | 'Exhale' =
          p === 'Inhale' ? 'Hold' : p === 'Hold' ? 'Exhale' : 'Inhale';
        runPhase(next);
      }
    }, 1000);
  }

  function startBreathing() {
    setBreathing(true);
    dispatch({ type: 'UNLOCK_BADGE', badge: 'calmMind' });
    runPhase('Inhale');
  }

  function stopBreathing() {
    setBreathing(false);
    if (breathRef.current) clearInterval(breathRef.current);
    breathAnim.setValue(0); setPhase('Inhale'); setCount(4);
  }

  useEffect(() => () => { if (breathRef.current) clearInterval(breathRef.current); }, []);

  const circleSize = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [72, 140] });
  const circleOp   = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  const emailBody = selectedTask && lecturer
    ? `Dear ${lecturer},\n\nI am writing to respectfully request a deadline extension for "${selectedTask}".\n\nDue to ${reason.toLowerCase()}, I have been unable to meet the original deadline. I am committed to submitting quality work and kindly request a 3 to 5 day extension.\n\nThank you for your understanding.\n\nWarm regards,\nAmni Binti Abdullah\nStudent ID: 2310847\nHCI Programme, IIUM`
    : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>

        {/* ── HEADER — eyebrow badge + editorial copy ── */}
        <View style={styles.header}>
          <View style={styles.crisistag}>
            <Warning size={10} color={colors.danger} weight="fill" />
            <Text style={styles.crisisTagTxt}>CRISIS MODE</Text>
          </View>
          <Text style={styles.heading}>You've got this.</Text>
          <Text style={styles.subheading}>
            Triage what matters most. One thing at a time.
          </Text>
        </View>

        <View style={styles.body}>

          {/* ── URGENT TASKS ── */}
          <FadeInView delay={60}>
            {/* P0: explicit hex alpha — never string concat on danger */}
            <View style={[styles.card, { borderColor: '#ef444430' }]}>
              <Text style={styles.cardTitle}>Urgent Tasks</Text>
              {urgentTasks.length === 0 ? (
                <View style={styles.allClear}>
                  <CheckCircle size={18} color={colors.success} weight="fill" />
                  <Text style={styles.allClearTxt}>No urgent tasks right now.</Text>
                </View>
              ) : (
                urgentTasks.map((task, i) => (
                  <View key={task.id}>
                    <View style={styles.triageRow}>
                      <View style={styles.triageDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.triageName}>{task.name}</Text>
                        <Text style={styles.triageMeta}>{task.category} · Due {task.date}</Text>
                      </View>
                      <View style={styles.extendTag}>
                        <Text style={styles.extendTxt}>Extendable</Text>
                      </View>
                    </View>
                    {i < urgentTasks.length - 1 && <View style={styles.rowLine} />}
                  </View>
                ))
              )}
            </View>
          </FadeInView>

          {/* ── EMAIL GENERATOR ── */}
          <FadeInView delay={120}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Extension Email</Text>

              <Text style={styles.fieldLabel}>Assignment</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {state.tasks.filter(t => t.category === 'Academic').map(t => (
                  <PressableScale
                    key={t.id}
                    style={[styles.chip, selectedTask === t.name && styles.chipActive]}
                    onPress={() => setSelectedTask(t.name)}
                  >
                    <Text style={[styles.chipTxt, selectedTask === t.name && styles.chipTxtActive]}>
                      {t.name}
                    </Text>
                  </PressableScale>
                ))}
              </ScrollView>

              <Text style={styles.fieldLabel}>Reason</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, { marginBottom: Spacing.sm }]}>
                {REASONS.map(r => (
                  <PressableScale
                    key={r}
                    style={[styles.chip, reason === r && styles.chipActive]}
                    onPress={() => setReason(r)}
                  >
                    <Text style={[styles.chipTxt, reason === r && styles.chipTxtActive]}>{r}</Text>
                  </PressableScale>
                ))}
              </ScrollView>

              <Text style={styles.fieldLabel}>Lecturer name</Text>
              <Textarea
                value={lecturer}
                onChangeText={setLecturer}
                placeholder="e.g. Prof. Hashim"
                minLines={2}
              />

              {emailBody ? (
                <View style={styles.emailBox}>
                  <Text style={styles.emailTxt}>{emailBody}</Text>
                </View>
              ) : (
                <Text style={styles.emailHint}>
                  Select an assignment and enter the lecturer name to generate.
                </Text>
              )}

              {emailBody && (
                <View style={{ marginTop: Spacing.sm }}>
                  <SlideToConfirm
                    text="Slide to copy email"
                    successText="Copied!"
                    onConfirm={() => {
                      dispatch({ type: 'UNLOCK_BADGE', badge: 'crisisManager' });
                      setCopied(true);
                      setToastVisible(true);
                      
                      // Actual Clipboard copy helper
                      if (Platform.OS === 'web') {
                        if (navigator?.clipboard) {
                          navigator.clipboard.writeText(emailBody).catch(() => {});
                        }
                      } else {
                        try {
                          const { Clipboard } = require('react-native');
                          Clipboard.setString(emailBody);
                        } catch (e) {}
                      }
                    }}
                    width={280}
                  />
                </View>
              )}
            </View>
          </FadeInView>

          {/* ── BREATHING COACH ── */}
          <FadeInView delay={180}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Box Breathing</Text>
              <Text style={styles.breathDesc}>
                4-4-4 rhythm. Inhale, hold, exhale, each 4 counts.
              </Text>

              <View style={styles.breathStage}>
                <Animated.View style={[
                  styles.breathCircle,
                  {
                    width:        circleSize,
                    height:       circleSize,
                    opacity:      circleOp,
                    borderWidth:  3,
                    borderRadius: circleSize.interpolate({ inputRange: [72, 140], outputRange: [36, 70] }) as any,
                    backgroundColor: phaseColor + '18',
                    borderColor:     phaseColor,
                  },
                ]}>
                  <Text style={styles.breathPhase}>{phase}</Text>
                  <Text style={[styles.breathCount, { color: phaseColor }]}>{count}</Text>
                </Animated.View>
              </View>

              <RippleButton
                style={[styles.primaryBtn, breathing && { backgroundColor: colors.danger }] as any}
                onPress={breathing ? stopBreathing : startBreathing}
                rippleColor="rgba(255,255,255,0.35)"
              >
                {breathing ? <Stop size={14} color='#ffffff' weight="fill" /> : <Play size={14} color={colors.canvas} weight="fill" />}
                <Text style={[styles.primaryBtnTxt, breathing && { color: '#ffffff' }]}>{breathing ? 'Stop' : 'Start Breathing'}</Text>
              </RippleButton>
            </View>
          </FadeInView>

          {/* ── CONTACTS ── */}
          <FadeInView delay={240}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>IIUM Wellbeing Support</Text>
              {CONTACTS.map((c, i) => (
                <View key={c.label}>
                  <PressableScale style={styles.contactRow} onPress={() => Linking.openURL(c.action)}>
                    {/* Tinted square icon — NOT bordered box */}
                    <View style={[styles.contactIcon, { backgroundColor: c.color + '18' }]}>
                      <c.PhosphorIcon size={16} color={c.color} weight="regular" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactName}>{c.label}</Text>
                      <Text style={styles.contactDetail}>{c.detail}</Text>
                    </View>
                    <CaretRight size={14} color={colors.inkFaint} weight="regular" />
                  </PressableScale>
                  {i < CONTACTS.length - 1 && <View style={styles.rowLine} />}
                </View>
              ))}
            </View>
          </FadeInView>

        </View>
      </ScrollView>

      <Toast
        visible={toastVisible}
        message="Email copied to clipboard!"
        description="Paste it directly into your email client."
        onHide={() => setToastVisible(false)}
        duration={2500}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvasSoft },

  // Header
  header: {
    backgroundColor: colors.canvas,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.hairline,
  },
  crisistag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#ef444415',
    paddingHorizontal: Spacing.xs, paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1, borderColor: '#ef444430',
    alignSelf: 'flex-start', marginBottom: Spacing.sm,
  },
  crisisTagTxt: { ...Typography.eyebrow, color: colors.danger },
  heading:      { ...Typography.heading1, color: colors.ink },
  subheading:   { ...Typography.bodyMd, color: colors.inkMuted, marginTop: 4 },

  body: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.sm },

  card: {
    backgroundColor: colors.canvas,
    borderRadius: Radii.md, borderWidth: 1, borderColor: colors.hairline,
    padding: Spacing.md, ...Shadows.soft,
  },
  cardTitle: { ...Typography.heading3, color: colors.ink, marginBottom: Spacing.sm },
  rowLine:   { height: 1, backgroundColor: colors.hairline },

  // Urgent tasks
  allClear: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.xs },
  allClearTxt: { ...Typography.bodyMd, color: colors.inkMuted },
  triageRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.sm,
  },
  triageDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  triageName: { ...Typography.bodySm, color: colors.ink },
  triageMeta: { ...Typography.caption, color: colors.inkFaint, marginTop: 2 },
  extendTag:  {
    backgroundColor: colors.stickerTeal + '18',
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: Radii.full,
  },
  extendTxt:  { ...Typography.eyebrow, color: colors.stickerTeal },

  // Email generator
  fieldLabel: { ...Typography.eyebrow, color: colors.inkFaint, marginTop: Spacing.sm, marginBottom: 6 },
  chipScroll: { marginBottom: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 7,
    borderRadius: Radii.full, borderWidth: 1, borderColor: colors.hairline,
    backgroundColor: colors.canvasSoft, marginRight: Spacing.xs,
  },
  chipActive:    { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipTxt:       { ...Typography.caption, color: colors.inkMuted },
  chipTxtActive: { ...Typography.caption, color: colors.accent, fontWeight: '600' as const },
  input: {
    backgroundColor: colors.canvasSoft,
    borderWidth: 1, borderColor: colors.hairline,
    borderRadius: Radii.xs, padding: Spacing.sm,
    ...Typography.bodyMd, color: colors.ink, marginBottom: Spacing.sm,
  },
  emailBox: {
    backgroundColor: colors.canvasDim,
    borderRadius: Radii.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: colors.hairline,
    marginBottom: Spacing.sm,
  },
  emailTxt: { ...Typography.caption, color: colors.inkSecondary, lineHeight: 22 },
  emailHint: { ...Typography.caption, color: colors.inkFaint, fontStyle: 'italic', marginBottom: Spacing.sm },

  primaryBtn: {
    backgroundColor: colors.ink,
    borderRadius: Radii.full, paddingVertical: Spacing.sm,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
  },
  primaryBtnSuccess: { backgroundColor: colors.success },
  primaryBtnTxt:     { ...Typography.button, color: colors.canvas },

  // Breathing
  breathDesc: { ...Typography.caption, color: colors.inkMuted, marginBottom: Spacing.lg },
  breathStage: { alignItems: 'center', justifyContent: 'center', height: 180, marginBottom: Spacing.lg },
  breathCircle: { alignItems: 'center', justifyContent: 'center' },
  breathPhase:  { ...Typography.eyebrow, color: colors.inkMuted, marginBottom: 4 },
  breathCount: {
    fontSize: 40, fontWeight: '700' as const, letterSpacing: -2, lineHeight: 44,
  },

  // Contacts — tinted icon square
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.sm,
  },
  contactIcon: {
    width: 36, height: 36, borderRadius: Radii.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  contactName:   { ...Typography.bodySm, color: colors.ink },
  contactDetail: { ...Typography.caption, color: colors.inkMuted, marginTop: 1 },
});
