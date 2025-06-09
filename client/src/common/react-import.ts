/**
 * Central import utility to standardize React imports throughout the application
 * This helps avoid TypeScript errors with imports and React hooks
 * 
 * This file serves as a single source of truth for common imports used throughout the application,
 * which helps with refactoring and ensures consistent usage of APIs.
 */

// Core React
import React, { 
  useState, 
  useEffect, 
  useRef, 
  useContext, 
  createContext, 
  useMemo, 
  useCallback,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  Fragment,
  Suspense,
  lazy,
  type ReactNode,
  type ReactElement,
  type RefObject,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type KeyboardEvent,
  type FocusEvent
} from 'react';

export { 
  React, 
  useState, 
  useEffect, 
  useRef, 
  useContext, 
  createContext, 
  useMemo, 
  useCallback,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  Fragment,
  Suspense,
  lazy,
  // Types
  type ReactNode,
  type ReactElement,
  type RefObject,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type KeyboardEvent,
  type FocusEvent
};

// React DOM
import ReactDOM from 'react-dom';
export { ReactDOM };

// React Hook Form
import { 
  useForm, 
  useFormContext, 
  useWatch, 
  Controller, 
  FormProvider, 
  useController,
  useFieldArray,
  type UseFormReturn,
  type FieldValues,
  type UseFormProps,
  type FieldPath,
  type FieldPathValue,
  type Control,
  type FieldErrors,
  type DeepPartial,
  type UseFormRegister,
  type RegisterOptions,
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormReset,
  type FormState
} from 'react-hook-form';

export { 
  useForm, 
  useFormContext, 
  useWatch, 
  Controller, 
  FormProvider, 
  useController,
  useFieldArray,
  // Types
  type UseFormReturn,
  type FieldValues,
  type UseFormProps,
  type FieldPath,
  type FieldPathValue,
  type Control,
  type FieldErrors,
  type DeepPartial,
  type UseFormRegister,
  type RegisterOptions,
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormReset,
  type FormState
};

// Resolvers
import { zodResolver } from '@hookform/resolvers/zod';
export { zodResolver };

// Zod
import * as z from 'zod';
export { z };

// TanStack React Query
import { 
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type QueryFunction,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationResult,
  type QueryClient
} from '@tanstack/react-query';

export {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type QueryFunction,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationResult,
  type QueryClient
};

// Wouter
import { useLocation, Link, Route, Switch } from 'wouter';
export { useLocation, Link, Route, Switch };

// Lucide Icons - Add commonly used icons here
import {
  Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Settings, User, Home, Search, Menu, AlertTriangle, Info,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Plus, Minus,
  Edit, Trash, Download, Upload, Save, Loader, RefreshCw,
  MoreHorizontal, MoreVertical, Calendar, Clock, Eye, EyeOff,
  FileText, File, Folder, Globe, Mail, Phone, Lock, Unlock,
  CircleAlert, CheckCircle2, XCircle, HelpCircle, Bell,
  type LucideProps, type Icon as LucideIcon
} from 'lucide-react';

export {
  Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Settings, User, Home, Search, Menu, AlertTriangle, Info,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Plus, Minus,
  Edit, Trash, Download, Upload, Save, Loader, RefreshCw,
  MoreHorizontal, MoreVertical, Calendar, Clock, Eye, EyeOff,
  FileText, File, Folder, Globe, Mail, Phone, Lock, Unlock,
  CircleAlert, CheckCircle2, XCircle, HelpCircle, Bell,
  type LucideProps, type LucideIcon
};

// class-variance-authority for component variants
import { cva, type VariantProps } from 'class-variance-authority';
export { cva, type VariantProps };

// clsx and tailwind-merge for class name management
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { clsx, twMerge, type ClassValue };

// Type definitions for custom UI components
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}