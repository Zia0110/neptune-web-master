import { Pipe, PipeTransform } from '@angular/core'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'UtcToLocalDatePipe' })
export class UtcToLocalDatePipe implements PipeTransform {
  constructor() {}

  transform(utcDate: Date): Date {
    return utcDate ? new Date(utcDate.toString().replace('T', ' ') + ' UTC') : utcDate
  }
}
