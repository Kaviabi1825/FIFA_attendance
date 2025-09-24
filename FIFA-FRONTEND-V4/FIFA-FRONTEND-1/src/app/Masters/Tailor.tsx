import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

export default function Tailor() {
  const [tab, setTab] = useState<'Tailors'|'Skills'>('Tailors');
  const totalTailors = [
    { id: 1, name: 'Ravi', skill: 'Stitching', experience: 10 },
    { id: 2, name: 'Suresh', skill: 'Buttoning', experience: 6 },
    { id: 3, name: 'Kumar', skill: 'Stitching', experience: 4 }
  ];

  const bySkill: Record<string, { id:number; name:string }[]> = {
    Stitching: [ { id:1, name:'Ravi' }, { id:3, name:'Kumar' } ],
    Buttoning: [ { id:2, name:'Suresh' } ]
  };

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabItem, tab==='Tailors' && styles.tabActive]} onPress={()=>{ setTab('Tailors'); setSelectedSkill(null); }}>
          <Text style={{fontWeight:'600'}}>Tailors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, tab==='Skills' && styles.tabActive]} onPress={()=>{ setTab('Skills'); setSelectedSkill(null); }}>
          <Text style={{fontWeight:'600'}}>Skills</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'Tailors' && (
          <>
            <Text style={{fontWeight:'700', marginBottom:8}}>Total Tailors: {totalTailors.length}</Text>
            {totalTailors.map(t => (
              <Card key={t.id} style={{marginBottom:8}}>
                <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                  <View style={{flex:1}}>
                    <Text style={{fontWeight:'700'}}>{t.name}</Text>
                    <Text>Experience : {t.experience || 10} years</Text>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={{fontWeight:'600'}}>{t.skill}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'Skills' && (
          <>
            {Object.keys(bySkill).map(skill => (
              <TouchableOpacity key={skill} style={styles.skillRow} onPress={() => setSelectedSkill(skill)}>
                <Text style={{fontWeight:'600'}}>{skill} ({bySkill[skill].length})</Text>
              </TouchableOpacity>
            ))}

            {selectedSkill && (
              <View style={{marginTop:12}}>
                <Text style={{fontWeight:'700'}}>{selectedSkill} - Tailors</Text>
                {bySkill[selectedSkill].map(t => (
                  <Text key={t.id}>- {t.name}</Text>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: '#f6f6f6' },
  tabItem: { flex:1, padding: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#009688' },
  skillRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }
});
