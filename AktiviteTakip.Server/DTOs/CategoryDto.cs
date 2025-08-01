﻿using System.ComponentModel.DataAnnotations;

namespace AktiviteTakip.Server.DTOs
{
    public sealed class CategoryDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "İsim zorunludur")]
        public string Name { get; set; }
    }
}
