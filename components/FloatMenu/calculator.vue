<script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Computed v-model binding for the dialog visibility
  const visible = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val)
  });
  
  const calculatorValue = ref('0');
  
  // Append a value (digit, operator, or parenthesis) to the current expression
  const appendValue = (value: string) => {
    if (calculatorValue.value === '0' || calculatorValue.value === 'Error') {
      calculatorValue.value = value;
    } else {
      calculatorValue.value += value;
    }
  };
  
  // Clear the current expression
  const clearCalculator = () => {
    calculatorValue.value = '0';
  };
  
  // Delete the last character from the expression
  const deleteLast = () => {
    if (calculatorValue.value.length === 1) {
      calculatorValue.value = '0';
    } else {
      calculatorValue.value = calculatorValue.value.slice(0, -1);
    }
  };
  
  // Evaluate the expression safely
  const evaluateExpression = () => {
    try {
      // Warning: Using Function for evaluation. Consider using a math parser library like mathjs in production.
      const result = Function('"use strict";return (' + calculatorValue.value + ')')();
      calculatorValue.value = result.toString();
    } catch (error: unknown) {
        console.log("error:", error)
      calculatorValue.value = 'Error';
    }
  };
  
  // Close the dialog
  const close = () => {
    visible.value = false;
  };
  </script>

<template>
    <v-dialog v-model="visible" persistent max-width="400">
      <v-card class="calculator-card" dark>
        <v-card-title class="calculator-title">
          <span>Calculator</span>
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="calculator-container">
            <transition name="fade">
              <input key="display" class="calculator-display" type="text" v-model="calculatorValue" readonly />
            </transition>
            <div class="calculator-buttons">
              <!-- Row 1: Clear, Delete, Open and Close Parentheses -->
              <v-row dense>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="clearCalculator">C</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="deleteLast">⌫</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('(')">(</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue(')')">)</v-btn>
                </v-col>
              </v-row>
              <!-- Row 2: 7,8,9, Division -->
              <v-row dense>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('7')">7</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('8')">8</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('9')">9</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('/')">/</v-btn>
                </v-col>
              </v-row>
              <!-- Row 3: 4,5,6, Multiplication -->
              <v-row dense>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('4')">4</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('5')">5</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('6')">6</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('*')">*</v-btn>
                </v-col>
              </v-row>
              <!-- Row 4: 1,2,3, Subtraction -->
              <v-row dense>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('1')">1</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('2')">2</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('3')">3</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('-')">-</v-btn>
                </v-col>
              </v-row>
              <!-- Row 5: 0, Decimal, Equals, Addition -->
              <v-row dense>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('0')">0</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('.')">.</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="evaluateExpression">=</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn class="calc-btn" @click="appendValue('+')">+</v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
  
  <style scoped>
  .calculator-card {
    background-color: #1e1e1e;
    color: white;
  }
  
  .calculator-title {
    font-weight: bold;
    font-size: 1.2rem;
    padding: 20px;
  }
  
  .calculator-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .calculator-display {
    width: 100%;
    height: 60px;
    text-align: right;
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #333;
    border: none;
    color: white;
    border-radius: 4px;
  }
  
  /* Calculator buttons grid */
  .calculator-buttons {
    width: 100%;
  }
  
  .calc-btn {
    width: 100%;
    height: 50px;
    font-size: 1.2rem;
    background-color: #ffd700;
    color: black;
    border-radius: 4px;
    transition: transform 0.1s ease-in-out;
  }
  
  .calc-btn:active {
    transform: scale(0.95);
  }
  
  /* Fade transition for display */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  